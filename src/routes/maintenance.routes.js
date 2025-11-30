// src/routes/maintenance.routes.js
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');

// AUTO SCHEDULE for a batch
router.post('/schedule/auto', maintenanceController.autoScheduleForBatch);

// VIEW TODAY SCHEDULE
router.get('/schedule/today', maintenanceController.getTodaySchedule);

module.exports = router;