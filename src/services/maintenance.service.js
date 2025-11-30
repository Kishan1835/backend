// src/services/maintenance.service.js
import schedulingService from './scheduling.service.js';
import * as scheduleLogRepo from '../repositories/scheduleLog.repository.js';

export const autoScheduleForBatch = schedulingService.autoScheduleForBatch;

// READ today schedule
export const getTodaySchedule = async ({ itiId, tradeId, batch }) => {
    return scheduleLogRepo.findTodayByFilter({ itiId, tradeId, batch });
};