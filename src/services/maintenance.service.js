// src/services/maintenance.service.js
import * as studentsRepo from '../repositories/students.repository.js';
import * as machinesRepo from '../repositories/machines.repository.js';
import * as scheduleLogRepo from '../repositories/scheduleLog.repository.js';

// AUTO SCHEDULE logic
export const autoScheduleForBatch = async ({ itiId, tradeId, batch, timeSlotMinutes, workerId }) => {
    const students = await studentsRepo.findByBatch({ itiId, tradeId, batch });
    if (!students.length) {
        return { logs: [], unscheduledStudents: students, message: 'No students in batch' };
    }

    const machines = await machinesRepo.findForScheduling(itiId);
    // Only use truly healthy machines for student scheduling.
    // ALERT or CRITICAL machines should not be assigned to students; they
    // need maintenance and should be handled by the maintenance flow.
    const availableMachines = machines.filter((m) => m.Status === 'HEALTHY');

    if (!availableMachines.length) {
        return { logs: [], unscheduledStudents: students, message: 'No available machines' };
    }

    const logsToCreate = [];
    const usedMachineIds = new Set();
    const now = new Date();
    let machineIndex = 0;

    for (const student of students) {
        const machine = availableMachines[machineIndex];

        logsToCreate.push({
            ITI_ID: itiId,
            Machine_ID: machine.Machine_ID,
            Worker_ID: workerId,
            Student_ID: student.Student_ID,
            Time: timeSlotMinutes,
            Scheduled_On: now,
            Completed_At: null,
        });

        usedMachineIds.add(machine.Machine_ID);
        machineIndex = (machineIndex + 1) % availableMachines.length;
    }

    const createdLogs = await scheduleLogRepo.createManyWithMachineUpdates({
        logs: logsToCreate,
        machineIds: Array.from(usedMachineIds),
    });

    return { logs: createdLogs, unscheduledStudents: [] };
};

// READ today schedule
export const getTodaySchedule = async ({ itiId, tradeId, batch }) => {
    return scheduleLogRepo.findTodayByFilter({ itiId, tradeId, batch });
};