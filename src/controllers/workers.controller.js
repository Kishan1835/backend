import * as workerRepository from '../repositories/workers.repository.js';
import { logAction } from '../utils/logger.js';

export const createWorker = async (req, res) => {
    try {
        const newWorker = await workerRepository.createWorker(req.body);
        await logAction('ITI_Worker', newWorker.Worker_ID, 'Create ITI Worker', { worker: newWorker.Name, role: newWorker.Role });
        res.status(201).json(newWorker);
    } catch (error) {
        console.error('Error creating ITI Worker:', error);
        await logAction('ITI_Worker', null, 'Create ITI Worker Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllWorkers = async (req, res) => {
    try {
        const workers = await workerRepository.getAllWorkers();
        await logAction('ITI_Worker', null, 'Get All ITI Workers', { count: workers.length });
        res.status(200).json(workers);
    } catch (error) {
        console.error('Error fetching ITI Workers:', error);
        await logAction('ITI_Worker', null, 'Get All ITI Workers Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await workerRepository.getWorkerById(parseInt(id));
        if (!worker) {
            await logAction('ITI_Worker', id, 'Get ITI Worker by ID', { status: 'Not found' });
            return res.status(404).json({ message: 'ITI Worker not found' });
        }
        await logAction('ITI_Worker', id, 'Get ITI Worker by ID', { worker: worker.Name, role: worker.Role });
        res.status(200).json(worker);
    } catch (error) {
        console.error('Error fetching ITI Worker by ID:', error);
        await logAction('ITI_Worker', req.params.id, 'Get ITI Worker by ID Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedWorker = await workerRepository.updateWorker(parseInt(id), req.body);
        if (!updatedWorker) {
            await logAction('ITI_Worker', id, 'Update ITI Worker', { status: 'Not found' });
            return res.status(404).json({ message: 'ITI Worker not found' });
        }
        await logAction('ITI_Worker', id, 'Update ITI Worker', { worker: updatedWorker.Name, updates: req.body });
        res.status(200).json(updatedWorker);
    } catch (error) {
        console.error('Error updating ITI Worker:', error);
        await logAction('ITI_Worker', req.params.id, 'Update ITI Worker Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteWorker = async (req, res) => {
    try {
        const { id } = req.params;
        await workerRepository.deleteWorker(parseInt(id));
        await logAction('ITI_Worker', id, 'Delete ITI Worker', { status: 'Success' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting ITI Worker:', error);
        await logAction('ITI_Worker', req.params.id, 'Delete ITI Worker Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};
