// src/routes/maintenance.routes.js
import express from 'express';
const router = express.Router();
import { markCaseAsSolved, escalateMaintenanceCase, notifyPolicyMaker, autoScheduleForBatch, getTodaySchedule, getMaintenanceLogsByITI } from '../controllers/maintenance.controller.js';

router.post('/mark-solved', markCaseAsSolved);
router.post('/escalate', escalateMaintenanceCase);
router.post('/notify-policy-maker', notifyPolicyMaker);
router.post('/schedule/auto', autoScheduleForBatch);
router.get('/schedule/today', getTodaySchedule);
router.get('/logs/iti/:itiId', getMaintenanceLogsByITI);

export default router;