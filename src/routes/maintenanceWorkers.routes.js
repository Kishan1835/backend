import express from 'express';
const router = express.Router();
import { createMaintenanceWorker, getAllMaintenanceWorkers, getMaintenanceWorkerById, updateMaintenanceWorker, deleteMaintenanceWorker } from '../controllers/maintenanceWorkers.controller.js';

router.post('/', createMaintenanceWorker);
router.get('/', getAllMaintenanceWorkers);
router.get('/:id', getMaintenanceWorkerById);
router.put('/:id', updateMaintenanceWorker);
router.delete('/:id', deleteMaintenanceWorker);

export default router;
