// src/routes/maintenance.routes.js
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');

router.post('/schedule/auto', maintenanceController.autoScheduleForBatch);
router.get('/schedule/today', maintenanceController.getTodaySchedule);

module.exports = router;