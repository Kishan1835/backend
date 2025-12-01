import prisma from '../config/prismaClient.js';

/**
 * Dashboard Repository
 * Handles all aggregate data queries for NCVET dashboard
 */

export const getNCVETDashboardStats = async () => {
    try {
        const [
            totalITIs,
            totalStudents,
            totalMachines,
            pendingComplaints,
            resolvedComplaints,
            machineStatusSummary,
            complaintsSeverity,
            totalWorkers,
        ] = await Promise.all([
            // Total ITIs/Branches
            prisma.iTI.count().catch(err => { console.error('ERROR: iTI.count():', err.message); throw err; }),

            // Total Students across all ITIs
            prisma.students.count().catch(err => { console.error('ERROR: students.count():', err.message); throw err; }),

            // Total Machines across all ITIs
            prisma.machines.count().catch(err => { console.error('ERROR: machines.count():', err.message); throw err; }),

            // Pending/In Progress complaints
            prisma.maintenance_Log.count({
                where: {
                    Status: {
                        in: ['PENDING', 'IN_PROGRESS']
                    }
                }
            }).catch(err => { console.error('ERROR: maintenance_Log pending count:', err.message); throw err; }),

            // Resolved complaints
            prisma.maintenance_Log.count({
                where: {
                    Status: 'RESOLVED'
                }
            }).catch(err => { console.error('ERROR: maintenance_Log resolved count:', err.message); throw err; }),

            // Machine status breakdown
            prisma.machines.groupBy({
                by: ['Status'],
                _count: {
                    Machine_ID: true
                }
            }).catch(err => { console.error('ERROR: machines groupBy:', err.message); throw err; }),

            // Complaints severity breakdown
            prisma.maintenance_Log.groupBy({
                by: ['Severity'],
                _count: {
                    ML_ID: true
                }
            }).catch(err => { console.error('ERROR: maintenance_Log groupBy:', err.message); throw err; }),

            // Total maintenance workers
            prisma.maintenance_Workers.count().catch(err => { console.error('ERROR: maintenance_Workers.count():', err.message); throw err; })
        ]);

        return {
            branches: totalITIs,
            students: totalStudents,
            machines: totalMachines,
            complaints: pendingComplaints + resolvedComplaints,
            pendingComplaints,
            resolvedComplaints,
            technicians: totalWorkers,
            machineStatus: machineStatusSummary,
            complaintsSeverity,
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Dashboard stats error:', error);
        throw new Error(`Failed to fetch dashboard statistics: ${error.message}`);
    }
};

export const getComplaintsAcrossAllITIs = async (limit = 100, offset = 0) => {
    return prisma.maintenance_Log.findMany({
        include: {
            machine: {
                include: {
                    iti: {
                        select: {
                            Name: true,
                            City: true,
                        }
                    }
                }
            },
            maintenance_Workers: {
                select: {
                    M_Worker_ID: true,
                    Name: true,
                    Contact: true,
                }
            }
        },
        orderBy: {
            ML_ID: 'desc'
        },
        take: limit,
        skip: offset,
    });
};

export const getMachinesAcrossAllITIs = async (limit = 100, offset = 0) => {
    return prisma.machines.findMany({
        include: {
            iti: {
                select: {
                    ITI_ID: true,
                    Name: true,
                    City: true,
                }
            }
        },
        orderBy: [
            { ITI_ID: 'asc' },
            { Machine_ID: 'asc' }
        ],
        take: limit,
        skip: offset,
    });
};

export const getComplaintsCountAcrossAllITIs = async () => {
    return prisma.maintenance_Log.count();
};

export const getPendingComplaintsCountAcrossAllITIs = async () => {
    return prisma.maintenance_Log.count({
        where: {
            Status: {
                in: ['PENDING', 'IN_PROGRESS']
            }
        }
    });
};

export const getRecentComplaintsAcrossAllITIs = async (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.maintenance_Log.findMany({
        where: {
            Report_Date: {
                gte: startDate
            }
        },
        include: {
            machine: {
                include: {
                    iti: {
                        select: {
                            Name: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            Report_Date: 'desc'
        }
    });
};

export const getMachineStatusSummary = async () => {
    return prisma.machines.groupBy({
        by: ['Status'],
        _count: {
            Machine_ID: true
        }
    });
};

export const getComplaintsSeveritySummary = async () => {
    return prisma.maintenance_Log.groupBy({
        by: ['Severity'],
        _count: {
            ML_ID: true
        }
    });
};

export const getComplaintsStatusSummary = async () => {
    return prisma.maintenance_Log.groupBy({
        by: ['Status'],
        _count: {
            ML_ID: true
        }
    });
};

export const getITIStatsBreakdown = async () => {
    return prisma.iTI.findMany({
        include: {
            _count: {
                select: {
                    students: true,
                    machines: true,
                }
            }
        }
    });
};
