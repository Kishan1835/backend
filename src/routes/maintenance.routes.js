const router = require('express').Router();
const maintenanceController = require('../controllers/maintenance.controller');

router.post('/schedule/auto', maintenanceController.autoScheduleMachines);

module.exports = router;
