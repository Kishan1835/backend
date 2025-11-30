// src/controllers/maintenance.controller.js
const maintenanceService = require('../services/maintenance.service');
const { sendSuccess } = require('../utils/response');

// POST /maintenance/schedule/auto
exports.autoScheduleForBatch = async (req, res, next) => {
    try {
        const { itiId, tradeId, batch, timeSlotMinutes } = req.body;

        // later replace with auth (req.user.workerId)
        const workerId = Number(req.body.workerId) || 1;

        const result = await maintenanceService.autoScheduleForBatch({
            itiId: Number(itiId),
            tradeId: Number(tradeId),
            batch,
            timeSlotMinutes: Number(timeSlotMinutes) || 60,
            workerId,
        });

        return sendSuccess(res, 201, 'Schedule generated', result);
    } catch (err) {
        next(err);
    }
};

// GET /maintenance/schedule/today?itiId=&tradeId=&batch=
exports.getTodaySchedule = async (req, res, next) => {
    try {
        const { itiId, tradeId, batch } = req.query;

        const schedule = await maintenanceService.getTodaySchedule({
            itiId: Number(itiId),
            tradeId: tradeId ? Number(tradeId) : undefined,
            batch,
        });

        return sendSuccess(res, 200, 'Today schedule', schedule);
    } catch (err) {
        next(err);
    }
};