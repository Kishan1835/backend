// src/services/scheduling.service.js
import prisma from '../config/prismaClient.js';
import * as studentsRepo from '../repositories/students.repository.js';
import * as machinesRepo from '../repositories/machines.repository.js';
import * as scheduleLogRepo from '../repositories/scheduleLog.repository.js';
import { logAction } from '../utils/logger.js';

// Pure helper: build schedule rows from students and available machines.
// This is kept pure so we can unit test scheduling behavior without DB.
export const buildScheduleRows = ({ students = [], machines = [], timeSlotMinutes = 60, workerId = 1 }) => {
    const logs = [];
    const usedMachineIds = new Set();
    if (!machines || machines.length === 0) return { logs: [], usedMachineIds: [] };

    let machineIndex = 0;
    for (const student of students) {
        // If there are no machines at all, break
        if (machines.length === 0) break;

        const machine = machines[machineIndex];
        logs.push({
            ITI_ID: student.ITI_ID,
            Machine_ID: machine.Machine_ID,
            Worker_ID: workerId,
            Student_ID: student.Student_ID,
            Time: timeSlotMinutes,
            Scheduled_On: new Date(),
            Completed_At: null,
        });

        usedMachineIds.add(machine.Machine_ID);
        machineIndex = (machineIndex + 1) % machines.length;
    }

    return { logs, usedMachineIds: Array.from(usedMachineIds) };
};

// AUTO SCHEDULE logic with optimistic reservation and transactional creation
export const autoScheduleForBatch = async ({ itiId, tradeId, batch, timeSlotMinutes, workerId }) => {
    const students = await studentsRepo.findByBatch({ itiId, tradeId, batch });
    if (!students.length) {
        return { logs: [], unscheduledStudents: students, message: 'No students in batch' };
    }

    // Only allow truly healthy machines for student scheduling by default
    const machines = await machinesRepo.findForScheduling(itiId, ['HEALTHY']);
    if (!machines.length) {
        return { logs: [], unscheduledStudents: students, message: 'No available machines' };
    }

    // We'll attempt to reserve machines before creating schedule rows. For simplicity we
    // rotate machines across students. If a reservation fails for a chosen machine,
    // try the next machine; if none can be reserved, the student becomes unscheduled.

    const logsToCreate = [];
    const usedMachineIds = new Set();
    const unscheduled = [];
    const now = new Date();

    for (const student of students) {
        let reserved = false;
        // try each machine until reserved
        for (let i = 0; i < machines.length; i++) {
            const machine = machines[i];
            // double-check there is no open maintenance job
            const openMaintenance = await prisma.maintenance_Log.findFirst({
                where: { Machine_ID: machine.Machine_ID, Status: { in: ['Assigned', 'Pending', 'Escalated to TO'] } },
            });
            if (openMaintenance) continue;

            const reserveCount = await machinesRepo.reserveMachine(machine.Machine_ID);
            if (reserveCount === 1) {
                // reserved successfully
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
                reserved = true;
                break;
            }
            // otherwise someone else reserved it, try next machine
        }

        if (!reserved) unscheduled.push(student);
    }

    if (logsToCreate.length === 0) {
        // release any reservations just in case
        for (const mid of usedMachineIds) {
            await machinesRepo.releaseMachine(mid);
        }
        return { logs: [], unscheduledStudents: unscheduled, message: 'No reservations could be made' };
    }

    // Create schedule logs and update machines inside a transaction. Also release reservations.
    const createdLogs = await prisma.$transaction(async (tx) => {
        await tx.schedule_Logs.createMany({ data: logsToCreate });

        // update last_used for machines
        await Promise.all(
            Array.from(usedMachineIds).map((id) => tx.machines.update({ where: { Machine_ID: id }, data: { Last_used: now, Reserved: false } }))
        );

        const startOfDay = new Date(now.toDateString());
        return tx.schedule_Logs.findMany({
            where: { ITI_ID: itiId, Scheduled_On: { gte: startOfDay } },
            include: { student: true, machine: true, worker: true },
            orderBy: { S_Log_ID: 'asc' },
        });
    });

    // Log the scheduling action
    await logAction('ATO', workerId, 'Auto Schedule Generated', { itiId, created: createdLogs.length, unscheduled: unscheduled.length });

    return { logs: createdLogs, unscheduledStudents: unscheduled };
};

// Optional helper to release a reservation for external callers (e.g., IoT alerts)
export const autoReleaseMachineReservation = async (machineId) => {
    return machinesRepo.releaseMachine(machineId);
};

export default { autoScheduleForBatch, buildScheduleRows, autoReleaseMachineReservation };
