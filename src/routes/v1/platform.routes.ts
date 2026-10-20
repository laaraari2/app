
import { Router, Response, NextFunction } from 'express';
import { pool } from '../../db/postgres';

import { authenticate } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../types/auth';
import { ForbiddenError } from '../../errors/AppError';
import { env } from '../../config/env';
import { randomUUID } from 'crypto';

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

router.post('/institutions/logo', async (req, res) => {
  const { contentType, base64 } = req.body ?? {};
  const allowedTypes: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
  };

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({
      success: false,
      message: 'رفع اللوغو غير مفعّل في إعدادات الخادم حالياً.',
    });
  }

  if (
    typeof contentType !== 'string' ||
    !Object.prototype.hasOwnProperty.call(allowedTypes, contentType) ||
    typeof base64 !== 'string' ||
    !base64.length ||
    base64.length > Math.ceil((2 * 1024 * 1024 * 4) / 3) + 8 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)
  ) {
    return res.status(400).json({
      success: false,
      message: 'الملف غير صالح. استعمل PNG أو JPG أو WebP بحجم أقصى 2 MB.',
    });
  }

  const fileBuffer = Buffer.from(base64, 'base64');
  if (fileBuffer.length === 0 || fileBuffer.length > 2 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: 'حجم اللوغو خاصو ما يفوتش 2 MB.',
    });
  }

  const extension = allowedTypes[contentType];
  const objectName = `${randomUUID()}.${extension}`;
  const storageUrl = `${env.SUPABASE_URL.replace(/\\/$/, '')}/storage/v1/object/institution-logos/${objectName}`;

  try {
    const storageResponse = await fetch(storageUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: fileBuffer,
    });

    if (!storageResponse.ok) {
      return res.status(502).json({
        success: false,
        message: 'تعذر رفع اللوغو إلى التخزين. تحقق من إعدادات Supabase.',
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        logo_url: `${env.SUPABASE_URL.replace(/\\/$/, '')}/storage/v1/object/public/institution-logos/${objectName}`,
      },
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: 'تعذر الاتصال بخدمة تخزين اللوغو.',
    });
  }
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
