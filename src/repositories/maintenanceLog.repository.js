import prisma from '../config/prismaClient.js';

export const createMaintenanceLog = async (data) => {
    return prisma.maintenance_Log.create({ data });
};

export const getAllMaintenanceLogs = async () => {
    return prisma.maintenance_Log.findMany();
};

export const getMaintenanceLogById = async (id) => {
    return prisma.maintenance_Log.findUnique({ where: { ML_ID: id } });
};

export const updateMaintenanceLog = async (id, data) => {
    return prisma.maintenance_Log.update({ where: { ML_ID: id }, data });
};

export const deleteMaintenanceLog = async (id) => {
    return prisma.maintenance_Log.delete({ where: { ML_ID: id } });
};

export const findByITI = async (itiId) => {
    return prisma.maintenance_Log.findMany({
        where: {
            ITI_ID: itiId,
        },
        include: {
            machine: true,
            worker: true,
        },
        orderBy: { ML_ID: 'desc' },
    });
};

export const findByMachine = async (machineId) => {
    return prisma.maintenance_Log.findMany({
        where: {
            Machine_ID: machineId,
        },
        orderBy: { ML_ID: 'desc' },
    });
};
