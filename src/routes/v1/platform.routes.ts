
import { Router, Response, NextFunction } from 'express';
import { pool } from '../../db/postgres';

import { authenticate } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../types/auth';
import { ForbiddenError } from '../../errors/AppError';

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
