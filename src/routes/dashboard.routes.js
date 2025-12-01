import express from 'express';
const router = express.Router();
import {
    getNCVETDashboardStats,
    getComplaintsAcrossAllITIs,
    getMachinesAcrossAllITIs,
    getComplaintsSummary,
    getRecentComplaints,
    getMachineSummary,
    getITIStatsBreakdown,
} from '../controllers/dashboard.controller.js';

/**
 * NCVET Dashboard Routes
 * All routes require authentication
 * These endpoints provide aggregate data across all ITIs
 */

// Main dashboard statistics
router.get('/statistics', getNCVETDashboardStats);

// Complaints aggregation endpoints
router.get('/complaints', getComplaintsAcrossAllITIs);
router.get('/complaints/summary', getComplaintsSummary);
router.get('/complaints/recent', getRecentComplaints);

// Machines aggregation endpoints
router.get('/machines', getMachinesAcrossAllITIs);
router.get('/machines/summary', getMachineSummary);

// ITI breakdown statistics
router.get('/iti-breakdown', getITIStatsBreakdown);

export default router;
