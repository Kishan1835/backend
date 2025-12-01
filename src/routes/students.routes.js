import express from 'express';
const router = express.Router();
import { loginStudent, getAssignedMachines, getStudentsByITI } from '../controllers/students.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

router.post('/login', loginStudent);
router.get('/:studentId/machines', authenticateToken, getAssignedMachines);
router.get('/iti/:itiId', getStudentsByITI);

export default router;
