import * as dashboardRepo from '../repositories/dashboard.repository.js';
import { logAction } from '../utils/logger.js';

/**
 * Dashboard Controller
 * Handles all NCVET aggregate data endpoints
 */

export const getNCVETDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardRepo.getNCVETDashboardStats();

        await logAction('NCVET', null, 'Get Dashboard Statistics', {
            branches: stats.branches,
            students: stats.students,
            machines: stats.machines,
            complaints: stats.complaints,
            technicians: stats.technicians,
        });

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching NCVET dashboard stats:', error);
        await logAction('NCVET', null, 'Get Dashboard Statistics Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getComplaintsAcrossAllITIs = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const complaints = await dashboardRepo.getComplaintsAcrossAllITIs(
            parseInt(limit),
            parseInt(offset)
        );

        const totalCount = await dashboardRepo.getComplaintsCountAcrossAllITIs();

        await logAction('NCVET', null, 'Get All Complaints', {
            count: complaints.length,
            total: totalCount
        });

        res.status(200).json({
            data: complaints,
            pagination: {
                count: complaints.length,
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        await logAction('NCVET', null, 'Get All Complaints Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMachinesAcrossAllITIs = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const machines = await dashboardRepo.getMachinesAcrossAllITIs(
            parseInt(limit),
            parseInt(offset)
        );

        const totalCount = await dashboardRepo.getMachinesAcrossAllITIs(999999, 0);

        await logAction('NCVET', null, 'Get All Machines', {
            count: machines.length,
        });

        res.status(200).json({
            data: machines,
            pagination: {
                count: machines.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
            }
        });
    } catch (error) {
        console.error('Error fetching machines:', error);
        await logAction('NCVET', null, 'Get All Machines Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getComplaintsSummary = async (req, res) => {
    try {
        const [pendingCount, severitySummary, statusSummary] = await Promise.all([
            dashboardRepo.getPendingComplaintsCountAcrossAllITIs(),
            dashboardRepo.getComplaintsSeveritySummary(),
            dashboardRepo.getComplaintsStatusSummary(),
        ]);

        await logAction('NCVET', null, 'Get Complaints Summary', {
            pending: pendingCount
        });

        res.status(200).json({
            pendingCount,
            severitySummary,
            statusSummary,
        });
    } catch (error) {
        console.error('Error fetching complaints summary:', error);
        await logAction('NCVET', null, 'Get Complaints Summary Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRecentComplaints = async (req, res) => {
    try {
        const { days = 7 } = req.query;

        const complaints = await dashboardRepo.getRecentComplaintsAcrossAllITIs(parseInt(days));

        await logAction('NCVET', null, 'Get Recent Complaints', {
            days: parseInt(days),
            count: complaints.length
        });

        res.status(200).json({
            data: complaints,
            period: `Last ${days} days`,
            count: complaints.length,
        });
    } catch (error) {
        console.error('Error fetching recent complaints:', error);
        await logAction('NCVET', null, 'Get Recent Complaints Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMachineSummary = async (req, res) => {
    try {
        const statusSummary = await dashboardRepo.getMachineStatusSummary();

        await logAction('NCVET', null, 'Get Machine Summary', {
            statusCount: statusSummary.length
        });

        res.status(200).json({
            statusSummary
        });
    } catch (error) {
        console.error('Error fetching machine summary:', error);
        await logAction('NCVET', null, 'Get Machine Summary Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getITIStatsBreakdown = async (req, res) => {
    try {
        const itiStats = await dashboardRepo.getITIStatsBreakdown();

        await logAction('NCVET', null, 'Get ITI Stats Breakdown', {
            count: itiStats.length
        });

        res.status(200).json({
            data: itiStats,
            count: itiStats.length,
        });
    } catch (error) {
        console.error('Error fetching ITI stats breakdown:', error);
        await logAction('NCVET', null, 'Get ITI Stats Breakdown Error', {
            error: error.message
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
