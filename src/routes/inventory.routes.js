import express from 'express';
const router = express.Router();
import { createItem, getAllItems, getItemById, updateItem, deleteItem, checkReorderLevels } from '../controllers/inventory.controller.js';

router.post('/', createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.get('/reorder-levels', checkReorderLevels);

export default router;