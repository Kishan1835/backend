import prisma from '../config/prismaClient.js';
import { logAction } from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as studentsRepo from '../repositories/students.repository.js';
import * as machinesRepo from '../repositories/machines.repository.js';
import * as scheduleLogRepo from '../repositories/scheduleLog.repository.js';


export const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await prisma.students.findFirst({
            where: {
                Email: email,
            },
        });

        if (!student) {
            await logAction('Student', null, 'Login Failed', { email, reason: 'Student not found' });
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.PasswordHash) {
            await logAction('Student', student.Student_ID, 'Login Failed', { email, reason: 'Password not set' });
            return res.status(401).json({ message: 'Password not set for this account' });
        }

        const passwordMatch = await bcrypt.compare(password, student.PasswordHash);

        if (!passwordMatch) {
            await logAction('Student', student.Student_ID, 'Login Failed', { email, reason: 'Invalid credentials' });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const accessToken = jwt.sign({ studentId: student.Student_ID, email: student.Email }, process.env.ACCESS_TOKEN_SECRET);

        await logAction('Student', student.Student_ID, 'Login Successful', { email });
        res.status(200).json({ message: 'Login successful', student, accessToken });
    } catch (error) {
        console.error('Error during student login:', error);
        await logAction('Student', null, 'Login Error', { email, error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAssignedMachines = async (req, res) => {
    const { studentId } = req.params;
    try {
        const assignedMachines = await prisma.schedule_Logs.findMany({
            where: {
                Student_ID: parseInt(studentId),
            },
            include: {
                machine: true,
            },
        });

        if (!assignedMachines || assignedMachines.length === 0) {
            await logAction('Student', studentId, 'View Assigned Machines', { status: 'No machines found' });
            return res.status(404).json({ message: 'No machines assigned to this student' });
        }

        await logAction('Student', studentId, 'View Assigned Machines', { count: assignedMachines.length });
        res.status(200).json({ assignedMachines: assignedMachines.map(log => log.machine) });
    } catch (error) {
        console.error('Error fetching assigned machines:', error);
        await logAction('Student', studentId, 'View Assigned Machines Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};




export const autoScheduleForBatch = async ({ itiId, tradeId, batch, timeSlotMinutes, workerId }) => {
    const students = await studentsRepo.findByBatch({ itiId, tradeId, batch });
    if (!students.length) {
        return { logs: [], unscheduledStudents: students, message: 'No students in batch' };
    }

    const machines = await machinesRepo.findForScheduling(itiId);
    const availableMachines = machines.filter(
        (m) => m.Status === 'HEALTHY' || m.Status === 'ALERT'
    );

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