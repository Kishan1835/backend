import express from 'express';
const router = express.Router();
import { createWorker, getAllWorkers, getWorkerById, updateWorker, deleteWorker } from '../controllers/workers.controller.js';

router.post('/', createWorker);
router.get('/', getAllWorkers);
router.get('/:id', getWorkerById);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

export default router;
