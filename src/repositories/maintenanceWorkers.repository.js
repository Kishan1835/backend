import prisma from '../config/prismaClient.js';

export const createMaintenanceWorker = async (data) => {
    return prisma.maintenance_Workers.create({ data });
};

export const getAllMaintenanceWorkers = async () => {
    return prisma.maintenance_Workers.findMany();
};

export const getMaintenanceWorkerById = async (id) => {
    return prisma.maintenance_Workers.findUnique({ where: { M_Worker_ID: id } });
};

export const updateMaintenanceWorker = async (id, data) => {
    return prisma.maintenance_Workers.update({ where: { M_Worker_ID: id }, data });
};

export const deleteMaintenanceWorker = async (id) => {
    return prisma.maintenance_Workers.delete({ where: { M_Worker_ID: id } });
};

export const findByITI = async (itiId) => {
    return prisma.maintenance_Workers.findMany({
        where: {
            ITI_ID: itiId,
        },
        orderBy: { M_Worker_ID: 'asc' },
    });
};
