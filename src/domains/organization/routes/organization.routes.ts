import { Router } from 'express';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { schoolController } from '../controllers/school.controller';
import { campusController } from '../controllers/campus.controller';
import { buildingController } from '../controllers/building.controller';
import { floorController } from '../controllers/floor.controller';
import { roomController } from '../controllers/room.controller';
import { organizationBulkController } from '../controllers/organization-bulk.controller';
import { organizationImportExportController } from '../controllers/organization-import-export.controller';
import { organizationActivityController } from '../controllers/organization-activity.controller';
import { organizationController } from '../../../controllers/organization.controller';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

// --- Organization Tree View ---
router.get('/tree', authorize('org:read'), organizationController.getOrganizationTree);

// --- Activity Timeline ---
router.get('/activity-timeline', authorize('org:read'), organizationActivityController.getTimeline);

// --- School Profile ---
router.get('/school/profile', authorize('org:read'), schoolController.getProfile);
router.post('/school/profile', authorize('org:write'), schoolController.createOrUpdateProfile);
router.get('/schools', authorize('org:read'), schoolController.listPaginated);
router.get('/schools/:id', authorize('org:read'), schoolController.getById);
router.delete('/schools/:id', authorize('org:write'), schoolController.softDelete);
router.post('/schools/:id/restore', authorize('org:write'), schoolController.restore);

// --- Campuses ---
router.get('/campuses', authorize('org:read'), campusController.listPaginated);
router.get('/campuses/:id', authorize('org:read'), campusController.getById);
router.post('/campuses', authorize('org:write'), campusController.create);
router.put('/campuses/:id', authorize('org:write'), campusController.update);
router.delete('/campuses/:id', authorize('org:write'), campusController.softDelete);
router.post('/campuses/:id/restore', authorize('org:write'), campusController.restore);
router.post('/campuses/:id/archive', authorize('org:write'), campusController.archive);

// --- Buildings ---
router.get('/buildings', authorize('org:read'), buildingController.listPaginated);
router.get('/buildings/:id', authorize('org:read'), buildingController.getById);
router.post('/buildings', authorize('org:write'), buildingController.create);
router.put('/buildings/:id', authorize('org:write'), buildingController.update);
router.delete('/buildings/:id', authorize('org:write'), buildingController.softDelete);
router.post('/buildings/:id/restore', authorize('org:write'), buildingController.restore);
router.post('/buildings/:id/archive', authorize('org:write'), buildingController.archive);

// --- Floors ---
router.get('/floors', authorize('org:read'), floorController.listPaginated);
router.get('/floors/:id', authorize('org:read'), floorController.getById);
router.post('/floors', authorize('org:write'), floorController.create);
router.put('/floors/:id', authorize('org:write'), floorController.update);
router.delete('/floors/:id', authorize('org:write'), floorController.softDelete);
router.post('/floors/:id/restore', authorize('org:write'), floorController.restore);
router.post('/floors/:id/archive', authorize('org:write'), floorController.archive);

// --- Rooms ---
router.get('/rooms', authorize('org:read'), roomController.listPaginated);
router.get('/rooms/:id', authorize('org:read'), roomController.getById);
router.post('/rooms', authorize('org:write'), roomController.create);
router.put('/rooms/:id', authorize('org:write'), roomController.update);
router.delete('/rooms/:id', authorize('org:write'), roomController.softDelete);
router.post('/rooms/:id/restore', authorize('org:write'), roomController.restore);
router.post('/rooms/:id/archive', authorize('org:write'), roomController.archive);

// --- Bulk Operations ---
router.post('/bulk/:entityType', authorize('org:write'), organizationBulkController.executeBulk);

// --- Import & Export ---
router.post('/import/campuses', authorize('org:write'), organizationImportExportController.importCampusesCsv);
router.post('/import/rooms', authorize('org:write'), organizationImportExportController.importRoomsCsv);
router.get('/export/campuses', authorize('org:read'), organizationImportExportController.exportCampusesCsv);
router.get('/export/rooms', authorize('org:read'), organizationImportExportController.exportRoomsCsv);

export default router;
