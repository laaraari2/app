import { Router } from 'express';
import academicYearRoutes from './academic-year.routes';
import academicTermRoutes from './academic-term.routes';
import educationalStageRoutes from './educational-stage.routes';
import gradeLevelRoutes from './grade-level.routes';
import classGroupRoutes from './class-group.routes';
import subjectCategoryRoutes from './subject-category.routes';
import subjectRoutes from './subject.routes';
import curriculumRoutes from './curriculum.routes';
import teachingAssignmentRoutes from './teaching-assignment.routes';
import timetableRoutes from './timetable.routes';
import schoolCalendarRoutes from './school-calendar.routes';
import academicEventRoutes from './academic-event.routes';
import academicBulkRoutes from './academic-bulk.routes';
import academicImportExportRoutes from './academic-import-export.routes';
import academicActivityRoutes from './academic-activity.routes';

const router = Router();

router.use('/academic-years', academicYearRoutes);
router.use('/terms', academicTermRoutes);
router.use('/educational-stages', educationalStageRoutes);
router.use('/grade-levels', gradeLevelRoutes);
router.use('/class-groups', classGroupRoutes);
router.use('/subject-categories', subjectCategoryRoutes);
router.use('/subjects', subjectRoutes);
router.use('/curriculums', curriculumRoutes);
router.use('/teaching-assignments', teachingAssignmentRoutes);
router.use('/timetable', timetableRoutes);
router.use('/calendars', schoolCalendarRoutes);
router.use('/events', academicEventRoutes);
router.use('/bulk', academicBulkRoutes);
router.use('/io', academicImportExportRoutes);
router.use('/timeline', academicActivityRoutes);

export default router;
