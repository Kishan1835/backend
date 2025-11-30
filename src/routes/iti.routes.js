import express from 'express';
const router = express.Router();
import { createITI, getAllITIs, getITIById, updateITI, deleteITI } from '../controllers/iti.controller.js';

router.post('/', createITI);
router.get('/', getAllITIs);
router.get('/:id', getITIById);
router.put('/:id', updateITI);
router.delete('/:id', deleteITI);

export default router;
