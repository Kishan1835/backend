import express from 'express';
const router = express.Router();
import { createMachine, getAllMachines, getMachineById, updateMachine, deleteMachine, requestMachineSchedule, assignMachineToStudent, getMachinesByITI } from '../controllers/machines.controller.js';

router.post('/', createMachine);
router.get('/', getAllMachines);
router.get('/iti/:itiId', getMachinesByITI);
router.get('/:id', getMachineById);
router.put('/:id', updateMachine);
router.delete('/:id', deleteMachine);
router.get('/schedule/:itiId', requestMachineSchedule);
router.post('/assign', assignMachineToStudent);

export default router;