// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/iti', require('./iti.routes'));
router.use('/machines', require('./machines.routes'));
router.use('/students', require('./students.routes'));
router.use('/maintenance', require('./maintenance.routes'));
router.use('/inventory', require('./inventory.routes'));
router.use('/students', require('./students.routes'));

module.exports = router;