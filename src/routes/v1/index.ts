import { Router } from 'express';
import authRoutes from './auth.routes';
import tenantRoutes from './tenant.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import auditRoutes from './audit.routes';
import healthRoutes from './health.routes';
import academicYearRoutes from './academic-year.routes';
import academicDomainRoutes from '../../domains/academic/routes';
import organizationRoutes from './organization.routes';
import settingsRoutes from './settings.routes';
import admissionsRoutes from '../../domains/admissions/routes';
import peopleRoutes from '../../domains/people/routes';
import attendanceRoutes from '../../domains/attendance/routes';
import platformRoutes from './platform.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/platform', platformRoutes);
router.use('/academic-years', academicYearRoutes);
router.use('/academic', academicDomainRoutes);
router.use('/organization', organizationRoutes);
router.use('/settings', settingsRoutes);
router.use('/admissions', admissionsRoutes);
router.use('/people', peopleRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
