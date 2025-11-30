// src/controllers/maintenance.controller.js
import * as maintenanceService from '../services/maintenance.service.js';
import { sendSuccess } from '../utils/response.js';
import prisma from '../config/prismaClient.js';
import { logAction } from '../utils/logger.js';

export const assignMaintenanceTask = async (machineId, issueReported, severity) => {
    try {
        const availableWorker = await prisma.maintenance_Workers.findFirst({
            where: {
                Active_Status: true,
            },
            orderBy: {
                Solved_cases: 'asc',
            },
        });

        if (!availableWorker) {
            console.warn('No available maintenance workers to assign task.');
            await logAction('System', null, 'Maintenance Task Assignment Failed', { machineId, issueReported, reason: 'No available workers' });
            return { success: false, message: 'No available maintenance workers' };
        }

        const machine = await prisma.machines.findUnique({ where: { Machine_ID: machineId } });
        const atoWorker = await prisma.iTI_Workers.findFirst({ where: { Role: 'ASSISTANT_TRAINING_OFFICER' } });

        if (!machine || !atoWorker) {
            console.error('Machine or ATO worker not found for maintenance assignment.');
            await logAction('System', null, 'Maintenance Task Assignment Failed', { machineId, issueReported, reason: 'Machine or ATO worker not found' });
            return { success: false, message: 'Failed to find necessary resources' };
        }

        const maintenanceLog = await prisma.maintenance_Log.create({
            data: {
                ITI_ID: machine.ITI_ID,
                Machine_ID: machineId,
                M_Worker_ID: availableWorker.M_Worker_ID,
                Worker_ID: atoWorker.Worker_ID,
                Issue_Reported: issueReported,
                Action_Taken: 'Pending',
                Severity: severity,
                Status: 'Assigned',
                Report_Date: new Date(),
                Next_Service_Date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
        });

        await prisma.maintenance_Workers.update({
            where: { M_Worker_ID: availableWorker.M_Worker_ID },
            data: {
                pending: { push: maintenanceLog.ML_ID.toString() },
            },
        });

        await logAction('System', availableWorker.M_Worker_ID, 'Maintenance Task Assigned', { machineId, issueReported, mlId: maintenanceLog.ML_ID });
        console.log(`Maintenance task assigned to Worker ${availableWorker.M_Worker_ID} for Machine ${machineId}`);
        return { success: true, message: 'Maintenance task assigned', maintenanceLog };
    } catch (error) {
        console.error('Error assigning maintenance task:', error);
        await logAction('System', null, 'Maintenance Task Assignment Error', { machineId, issueReported, error: error.message });
        return { success: false, message: 'Internal server error' };
    }
};

export const markCaseAsSolved = async (req, res) => {
    const { mlId, actionTaken } = req.body;
    try {
        const updatedLog = await prisma.maintenance_Log.update({
            where: {
                ML_ID: parseInt(mlId),
            },
            data: {
                Action_Taken: actionTaken,
                Status: 'Solved',
                Updated_At: new Date(),
            },
        });

        await prisma.maintenance_Workers.update({
            where: { M_Worker_ID: updatedLog.M_Worker_ID },
            data: {
                Solved_cases: { increment: 1 },
                pending: { set: (await prisma.maintenance_Workers.findUnique({ where: { M_Worker_ID: updatedLog.M_Worker_ID } })).pending.filter(id => id !== mlId.toString()) },
            },
        });

        await prisma.machines.update({
            where: { Machine_ID: updatedLog.Machine_ID },
            data: { Status: 'HEALTHY' },
        });

        await logAction('MaintenanceWorker', updatedLog.M_Worker_ID, 'Case Solved', { mlId, machineId: updatedLog.Machine_ID });
        res.status(200).json({ message: 'Maintenance case marked as solved', updatedLog });
    } catch (error) {
        console.error('Error marking case as solved:', error);
        await logAction('MaintenanceWorker', null, 'Case Solved Error', { mlId, error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const escalateMaintenanceCase = async (req, res) => {
    const { mlId, workerId } = req.body;
    try {
        const trainingOfficer = await prisma.iTI_Workers.findFirst({
            where: {
                Role: 'TRAINING_OFFICER',
            },
        });

        if (!trainingOfficer) {
            await logAction('MaintenanceWorker', workerId, 'Escalate Case Failed', { mlId, reason: 'Training Officer not found' });
            return res.status(404).json({ message: 'Training Officer not found' });
        }

        const updatedLog = await prisma.maintenance_Log.update({
            where: {
                ML_ID: parseInt(mlId),
                M_Worker_ID: parseInt(workerId),
            },
            data: {
                Worker_ID: trainingOfficer.Worker_ID,
                Status: 'Escalated to TO',
                Updated_At: new Date(),
            },
        });

        await logAction('MaintenanceWorker', workerId, 'Case Escalated to TO', { mlId, toWorkerId: trainingOfficer.Worker_ID });
        console.log(`Maintenance case ${mlId} escalated to Training Officer ${trainingOfficer.Worker_ID}`);

        res.status(200).json({ message: 'Maintenance case escalated to TO', updatedLog });
    } catch (error) {
        console.error('Error escalating maintenance case:', error);
        await logAction('MaintenanceWorker', workerId, 'Escalate Case Error', { mlId, error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const notifyPolicyMaker = async (req, res) => {
    const { mlId } = req.body;
    try {
        const policyMaker = await prisma.iTI_Workers.findFirst({
            where: {
                Role: 'POLICY_MAKER',
            },
        });

        if (!policyMaker) {
            await logAction('System', null, 'Notify Policy Maker Failed', { mlId, reason: 'Policy Maker not found' });
            return res.status(404).json({ message: 'Policy Maker not found' });
        }

        const updatedLog = await prisma.maintenance_Log.update({
            where: {
                ML_ID: parseInt(mlId),
            },
            data: {
                Status: 'Notified Policy Maker',
                Updated_At: new Date(),
            },
        });

        await logAction('System', policyMaker.Worker_ID, 'Notified Policy Maker', { mlId });
        console.log(`Policy Maker ${policyMaker.Worker_ID} notified about unresolved case ${mlId}`);

        res.status(200).json({ message: 'Policy Maker notified', updatedLog });
    } catch (error) {
        console.error('Error notifying policy maker:', error);
        await logAction('System', null, 'Notify Policy Maker Error', { mlId, error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const autoScheduleForBatch = async (req, res, next) => {
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

export const getTodaySchedule = async (req, res, next) => {
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