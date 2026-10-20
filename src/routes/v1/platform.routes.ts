
import { Router, Response, NextFunction } from 'express';
import { pool } from '../../db/postgres';

import { authenticate } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../types/auth';
import { ForbiddenError } from '../../errors/AppError';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { env } from '../../config/env';

const router = Router();



function requireSuperAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user?.roles?.includes('SUPER_ADMIN')) {
    throw new ForbiddenError('Super Admin access required');
  }

  next();
}

router.use(authenticate, requireSuperAdmin);

function createInstitutionSlug(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'institution';
}


const allowedLogoTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);

function isValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/png') {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/webp') {
    return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  }
  return false;
}

router.post('/institutions/logo', async (req, res) => {
  const { fileName, mimeType, base64 } = req.body ?? {};
  if (typeof fileName !== 'string' || typeof mimeType !== 'string' || typeof base64 !== 'string') {
    return res.status(400).json({ success: false, message: 'معلومات الصورة غير صالحة.' });
  }
  if (!allowedLogoTypes.has(mimeType)) {
    return res.status(415).json({ success: false, message: 'الصيغ المقبولة هي PNG وJPG وWebP فقط.' });
  }
  const encoded = base64.replace(/^data:[^;]+;base64,/, '');
  if (!encoded || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || encoded.length > Math.ceil((2 * 1024 * 1024 * 4) / 3) + 8) {
    return res.status(413).json({ success: false, message: 'حجم الصورة غير صالح أو تجاوز 2 MB.' });
  }
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length === 0 || bytes.length > 2 * 1024 * 1024) {
    return res.status(413).json({ success: false, message: 'حجم الصورة خاصو ما يفوتش 2 MB.' });
  }
  if (!isValidImageSignature(bytes, mimeType)) {
    return res.status(415).json({ success: false, message: 'محتوى الملف لا يطابق صيغة الصورة المختارة.' });
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ success: false, message: 'رفع اللوغو غير مهيأ على الخادم. تحقق من إعدادات Supabase.' });
  }

  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp';
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || `logo.${extension}`;
  const objectPath = `institutions/${randomUUID()}-${safeName.replace(/\.[^.]+$/, '')}.${extension}`;
  const storage = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await storage.storage.from('institution-logos').upload(objectPath, bytes, {
    contentType: mimeType,
    upsert: false,
    cacheControl: '3600',
  });
  if (error) {
    return res.status(502).json({ success: false, message: 'تعذر رفع اللوغو إلى التخزين. تحقق من إعدادات الحاوية.' });
  }
  const { data } = storage.storage.from('institution-logos').getPublicUrl(objectPath);
  return res.status(201).json({ success: true, data: { logo_url: data.publicUrl } });
});

router.get('/institutions', async (_req, res) => {
const result = await pool.query(`
    SELECT
      id,
      name,
      code,
      institution_type,
      email,
      phone,
      address,
      city,
      status,
      slug,
      logo_url,
      owner_id,
      created_at,
      updated_at
    FROM public.institutions
    ORDER BY created_at DESC
  `);

  return res.json({
    success: true,
    data: result.rows,
    count: result.rowCount ?? result.rows.length,
  });
});

router.post('/institutions', async (req, res) => {
  const {
    name,
    code,
    institution_type,
    email,
    phone,
    address,
    city,
    logo_url,
  } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof code !== 'string' ||
    !code.trim() ||
    typeof institution_type !== 'string' ||
    !institution_type.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: 'الاسم والرمز ونوع المؤسسة معلومات إجبارية.',
    });
  }

  const optionalFields = {
    email,
    phone,
    address,
    city,
    logo_url,
  };

  for (const [field, value] of Object.entries(optionalFields)) {
    if (
      value !== undefined &&
      value !== null &&
      typeof value !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: `الحقل ${field} خاصو يكون نصاً.`,
      });
    }
  }

  const cleanName = name.trim();
  const cleanCode = code.trim();
  const baseSlug = createInstitutionSlug(cleanName);
 const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Generate a unique URL slug.
    let slug = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await client.query(
        `SELECT 1 FROM public.institutions WHERE slug = $1 LIMIT 1`,
        [slug],
      );

      if ((existing.rowCount ?? 0) === 0) {
        break;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const result = await client.query(
      `
        INSERT INTO public.institutions (
          name,
          code,
          institution_type,
          email,
          phone,
          address,
          city,
          status,
          slug,
          logo_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE', $8, $9)
        RETURNING
          id,
          name,
          code,
          institution_type,
          email,
          phone,
          address,
          city,
          status,
          slug,
          logo_url,
          owner_id,
          created_at,
          updated_at
      `,
      [
        cleanName,
        cleanCode,
        institution_type.trim(),
        email?.trim() || null,
        phone?.trim() || null,
        address?.trim() || null,
        city?.trim() || null,
        slug,
        logo_url?.trim() || null,
      ],
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        login_url: `/${slug}`,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');

    const dbError = error as { code?: string };

    if (dbError.code === '23505') {
      return res.status(409).json({
        success: false,
        message:
          'رمز المؤسسة أو الرابط مستعمل من قبل. تحقق من المعلومات وحاول مرة أخرى.',
      });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
