import * as itiRepository from '../repositories/iti.repository.js';
import { logAction } from '../utils/logger.js';

export const createITI = async (req, res) => {
    try {
        const newITI = await itiRepository.createITI(req.body);
        await logAction('ITI', newITI.ITI_ID, 'Create ITI', { iti: newITI.Name });
        res.status(201).json(newITI);
    } catch (error) {
        console.error('Error creating ITI:', error);
        await logAction('ITI', null, 'Create ITI Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllITIs = async (req, res) => {
    try {
        const itis = await itiRepository.getAllITIs();
        await logAction('ITI', null, 'Get All ITIs', { count: itis.length });
        res.status(200).json(itis);
    } catch (error) {
        console.error('Error fetching ITIs:', error);
        await logAction('ITI', null, 'Get All ITIs Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getITIById = async (req, res) => {
    try {
        const { id } = req.params;
        const iti = await itiRepository.getITIById(parseInt(id));
        if (!iti) {
            await logAction('ITI', id, 'Get ITI by ID', { status: 'Not found' });
            return res.status(404).json({ message: 'ITI not found' });
        }
        await logAction('ITI', id, 'Get ITI by ID', { iti: iti.Name });
        res.status(200).json(iti);
    } catch (error) {
        console.error('Error fetching ITI by ID:', error);
        await logAction('ITI', req.params.id, 'Get ITI by ID Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateITI = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedITI = await itiRepository.updateITI(parseInt(id), req.body);
        if (!updatedITI) {
            await logAction('ITI', id, 'Update ITI', { status: 'Not found' });
            return res.status(404).json({ message: 'ITI not found' });
        }
        await logAction('ITI', id, 'Update ITI', { iti: updatedITI.Name, updates: req.body });
        res.status(200).json(updatedITI);
    } catch (error) {
        console.error('Error updating ITI:', error);
        await logAction('ITI', req.params.id, 'Update ITI Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteITI = async (req, res) => {
    try {
        const { id } = req.params;
        await itiRepository.deleteITI(parseInt(id));
        await logAction('ITI', id, 'Delete ITI', { status: 'Success' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting ITI:', error);
        await logAction('ITI', req.params.id, 'Delete ITI Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};
