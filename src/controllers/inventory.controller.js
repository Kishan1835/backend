import * as inventoryRepository from '../repositories/inventory.repository.js';
import { logAction } from '../utils/logger.js';

export const createItem = async (req, res) => {
    try {
        const newItem = await inventoryRepository.createItem(req.body);
        await logAction('Inventory', newItem.Item_ID, 'Create Item', { item: newItem.Item_Name });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        await logAction('Inventory', null, 'Create Item Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await inventoryRepository.getAllItems();
        await logAction('Inventory', null, 'Get All Items', { count: items.length });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        await logAction('Inventory', null, 'Get All Items Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await inventoryRepository.getItemById(parseInt(id));
        if (!item) {
            await logAction('Inventory', id, 'Get Item by ID', { status: 'Not found' });
            return res.status(404).json({ message: 'Item not found' });
        }
        await logAction('Inventory', id, 'Get Item by ID', { item: item.Item_Name });
        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        await logAction('Inventory', req.params.id, 'Get Item by ID Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await inventoryRepository.updateItem(parseInt(id), req.body);
        if (!updatedItem) {
            await logAction('Inventory', id, 'Update Item', { status: 'Not found' });
            return res.status(404).json({ message: 'Item not found' });
        }
        await logAction('Inventory', id, 'Update Item', { item: updatedItem.Item_Name, updates: req.body });
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        await logAction('Inventory', req.params.id, 'Update Item Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await inventoryRepository.deleteItem(parseInt(id));
        await logAction('Inventory', id, 'Delete Item', { status: 'Success' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting item:', error);
        await logAction('Inventory', req.params.id, 'Delete Item Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkReorderLevels = async (req, res) => {
    try {
        const itemsToReorder = await inventoryRepository.checkReorderLevel();
        await logAction('Inventory', null, 'Check Reorder Levels', { count: itemsToReorder.length });
        res.status(200).json({ itemsToReorder });
    } catch (error) {
        console.error('Error checking reorder levels:', error);
        await logAction('Inventory', null, 'Check Reorder Levels Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};
