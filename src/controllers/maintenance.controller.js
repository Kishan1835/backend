const maintenanceService = require('../services/maintenance.service');

exports.autoScheduleMachines = async (req, res, next) => {
    try {
        const { itiId, tradeId, batch, timeSlot } = req.body;

        // Basic validation
        if (!itiId || !tradeId || !batch || !timeSlot) {
            return res.status(400).json({ message: 'Missing required parameters: itiId, tradeId, batch, timeSlot' });
        }

        const { scheduledLogs, unscheduledStudents } = await maintenanceService.autoScheduleMachines({
            itiId,
            tradeId,
            batch,
            timeSlot,
        });

        res.status(201).json({ message: 'Machine scheduling completed.', scheduledLogs, unscheduledStudents });
    } catch (error) {
        next(error);
    }
};
