import * as maintenanceWorkerRepository from '../repositories/maintenanceWorkers.repository.js';
import { logAction } from '../utils/logger.js';

export const createMaintenanceWorker = async (req, res) => {
    try {
        const newWorker = await maintenanceWorkerRepository.createMaintenanceWorker(req.body);
        await logAction('MaintenanceWorker', newWorker.M_Worker_ID, 'Create Maintenance Worker', { worker: newWorker.Name });
        res.status(201).json(newWorker);
    } catch (error) {
        console.error('Error creating Maintenance Worker:', error);
        await logAction('MaintenanceWorker', null, 'Create Maintenance Worker Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllMaintenanceWorkers = async (req, res) => {
    try {
        const workers = await maintenanceWorkerRepository.getAllMaintenanceWorkers();
        await logAction('MaintenanceWorker', null, 'Get All Maintenance Workers', { count: workers.length });
        res.status(200).json(workers);
    } catch (error) {
        console.error('Error fetching Maintenance Workers:', error);
        await logAction('MaintenanceWorker', null, 'Get All Maintenance Workers Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMaintenanceWorkersByITI = async (req, res) => {
    try {
        const { itiId } = req.params;
        const workers = await maintenanceWorkerRepository.findByITI(parseInt(itiId));

        if (!workers || workers.length === 0) {
            await logAction('MaintenanceWorker', null, 'Get Maintenance Workers by ITI', { itiId, status: 'No workers found' });
            return res.status(200).json([]);
        }

        await logAction('MaintenanceWorker', null, 'Get Maintenance Workers by ITI', { itiId, count: workers.length });
        res.status(200).json(workers);
    } catch (error) {
        console.error('Error fetching Maintenance Workers by ITI:', error);
        await logAction('MaintenanceWorker', null, 'Get Maintenance Workers by ITI Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMaintenanceWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await maintenanceWorkerRepository.getMaintenanceWorkerById(parseInt(id));
        if (!worker) {
            await logAction('MaintenanceWorker', id, 'Get Maintenance Worker by ID', { status: 'Not found' });
            return res.status(404).json({ message: 'Maintenance Worker not found' });
        }
        await logAction('MaintenanceWorker', id, 'Get Maintenance Worker by ID', { worker: worker.Name });
        res.status(200).json(worker);
    } catch (error) {
        console.error('Error fetching Maintenance Worker by ID:', error);
        await logAction('MaintenanceWorker', req.params.id, 'Get Maintenance Worker by ID Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateMaintenanceWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedWorker = await maintenanceWorkerRepository.updateMaintenanceWorker(parseInt(id), req.body);
        if (!updatedWorker) {
            await logAction('MaintenanceWorker', id, 'Update Maintenance Worker', { status: 'Not found' });
            return res.status(404).json({ message: 'Maintenance Worker not found' });
        }
        await logAction('MaintenanceWorker', id, 'Update Maintenance Worker', { worker: updatedWorker.Name, updates: req.body });
        res.status(200).json(updatedWorker);
    } catch (error) {
        console.error('Error updating Maintenance Worker:', error);
        await logAction('MaintenanceWorker', req.params.id, 'Update Maintenance Worker Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteMaintenanceWorker = async (req, res) => {
    try {
        const { id } = req.params;
        await maintenanceWorkerRepository.deleteMaintenanceWorker(parseInt(id));
        await logAction('MaintenanceWorker', id, 'Delete Maintenance Worker', { status: 'Success' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting Maintenance Worker:', error);
        await logAction('MaintenanceWorker', req.params.id, 'Delete Maintenance Worker Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};
