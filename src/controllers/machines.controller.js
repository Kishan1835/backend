import prisma from '../config/prismaClient.js';
import { logAction } from '../utils/logger.js';
import * as machineRepository from '../repositories/machines.repository.js';
import * as scheduleLogRepository from '../repositories/scheduleLog.repository.js';
import { MachineStatus } from '@prisma/client';

export const createMachine = async (req, res) => {
    try {
        const newMachine = await machineRepository.createMachine(req.body);
        await logAction('Machine', newMachine.Machine_ID, 'Create Machine', { machine: newMachine.Machine_Name });
        res.status(201).json(newMachine);
    } catch (error) {
        console.error('Error creating machine:', error);
        await logAction('Machine', null, 'Create Machine Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllMachines = async (req, res) => {
    try {
        const machines = await machineRepository.getAllMachines();
        await logAction('Machine', null, 'Get All Machines', { count: machines.length });
        res.status(200).json(machines);
    } catch (error) {
        console.error('Error fetching machines:', error);
        await logAction('Machine', null, 'Get All Machines Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMachinesByITI = async (req, res) => {
    try {
        const { itiId } = req.params;
        const machines = await machineRepository.findByITI(parseInt(itiId));

        if (!machines || machines.length === 0) {
            await logAction('Machine', null, 'Get Machines by ITI', { itiId, status: 'No machines found' });
            return res.status(200).json([]);
        }

        await logAction('Machine', null, 'Get Machines by ITI', { itiId, count: machines.length });
        res.status(200).json(machines);
    } catch (error) {
        console.error('Error fetching machines by ITI:', error);
        await logAction('Machine', null, 'Get Machines by ITI Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMachineById = async (req, res) => {
    try {
        const { id } = req.params;
        const machine = await machineRepository.getMachineById(parseInt(id));
        if (!machine) {
            await logAction('Machine', id, 'Get Machine by ID', { status: 'Not found' });
            return res.status(404).json({ message: 'Machine not found' });
        }
        await logAction('Machine', id, 'Get Machine by ID', { machine: machine.Machine_Name });
        res.status(200).json(machine);
    } catch (error) {
        console.error('Error fetching machine by ID:', error);
        await logAction('Machine', req.params.id, 'Get Machine by ID Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateMachine = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMachine = await machineRepository.updateMachine(parseInt(id), req.body);
        if (!updatedMachine) {
            await logAction('Machine', id, 'Update Machine', { status: 'Not found' });
            return res.status(404).json({ message: 'Machine not found' });
        }
        await logAction('Machine', id, 'Update Machine', { machine: updatedMachine.Machine_Name, updates: req.body });
        res.status(200).json(updatedMachine);
    } catch (error) {
        console.error('Error updating machine:', error);
        await logAction('Machine', req.params.id, 'Update Machine Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteMachine = async (req, res) => {
    try {
        const { id } = req.params;
        await machineRepository.deleteMachine(parseInt(id));
        await logAction('Machine', id, 'Delete Machine', { status: 'Success' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting machine:', error);
        await logAction('Machine', req.params.id, 'Delete Machine Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const requestMachineSchedule = async (req, res) => {
    const { itiId } = req.params;
    try {
        const machines = await machineRepository.findForScheduling(parseInt(itiId));

        if (!machines || machines.length === 0) {
            await logAction('ATO', null, 'Request Machine Schedule', { itiId, status: 'No machines found' });
            return res.status(404).json({ message: 'No machines found for this ITI or all are critical' });
        }

        await logAction('ATO', null, 'Request Machine Schedule', { itiId, count: machines.length });
        res.status(200).json({ machines });
    } catch (error) {
        console.error('Error requesting machine schedule:', error);
        await logAction('ATO', null, 'Request Machine Schedule Error', { itiId, error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const assignMachineToStudent = async (req, res) => {
    const { studentId, machineId, workerId, time } = req.body;
    try {
        const machine = await machineRepository.getMachineById(parseInt(machineId));

        if (!machine || machine.Status === MachineStatus.CRITICAL) {
            await logAction('ATO', workerId, 'Assign Machine', { studentId, machineId, status: 'Machine not available or critical' });
            return res.status(400).json({ message: 'Machine not available or critical' });
        }

        const scheduleLog = await scheduleLogRepository.createManyWithMachineUpdates({
            logs: [{
                ITI_ID: machine.ITI_ID,
                Machine_ID: parseInt(machineId),
                Worker_ID: parseInt(workerId),
                Student_ID: parseInt(studentId),
                Time: parseInt(time),
                Scheduled_On: new Date(),
            }],
            machineIds: [parseInt(machineId)],
        });

        await logAction('ATO', workerId, 'Assign Machine', { studentId, machineId, status: 'Machine assigned successfully' });
        res.status(201).json({ message: 'Machine assigned successfully', scheduleLog });
    } catch (error) {
        console.error('Error assigning machine to student:', error);
        await logAction('ATO', workerId, 'Assign Machine Error', { studentId, machineId, error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};
