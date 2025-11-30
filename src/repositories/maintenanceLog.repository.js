import prisma from '../config/prismaClient.js';

export const createMaintenanceLog = (data) => {
    return prisma.maintenance_Log.create({ data });
};

export const getMaintenanceLogById = (id) => {
    return prisma.maintenance_Log.findUnique({ where: { ML_ID: id } });
};

export const findOpenByMachineId = (machineId) => {
    return prisma.maintenance_Log.findFirst({
        where: {
            Machine_ID: machineId,
            Status: { in: ['Assigned', 'Pending', 'Escalated to TO'] },
        },
    });
};

export const findByMachineId = (machineId) => {
    return prisma.maintenance_Log.findMany({ where: { Machine_ID: machineId }, orderBy: { Created_At: 'desc' } });
};

export const findByITI = (itiId) => {
    return prisma.maintenance_Log.findMany({ where: { ITI_ID: itiId }, orderBy: { Created_At: 'desc' } });
};

export const updateMaintenanceLog = (id, data) => {
    return prisma.maintenance_Log.update({ where: { ML_ID: id }, data });
};

export const closeMaintenanceLog = (id, actionTaken = 'Completed') => {
    return prisma.maintenance_Log.update({ where: { ML_ID: id }, data: { Status: 'Solved', Action_Taken: actionTaken, Updated_At: new Date() } });
};

export const deleteMaintenanceLog = (id) => {
    return prisma.maintenance_Log.delete({ where: { ML_ID: id } });
};

export default {
    createMaintenanceLog,
    getMaintenanceLogById,
    findOpenByMachineId,
    findByMachineId,
    findByITI,
    updateMaintenanceLog,
    closeMaintenanceLog,
    deleteMaintenanceLog,
};
