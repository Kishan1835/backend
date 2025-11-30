import express from 'express';
const router = express.Router();
import { loginStudent, getAssignedMachines } from '../controllers/students.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

router.post('/login', loginStudent);
router.get('/:studentId/machines', authenticateToken, getAssignedMachines);

export default router;
