import prisma from '../config/prismaClient.js';

export const createWorker = async (data) => {
    return prisma.iTI_Workers.create({ data });
};

export const getAllWorkers = async () => {
    return prisma.iTI_Workers.findMany();
};

export const getWorkerById = async (id) => {
    return prisma.iTI_Workers.findUnique({ where: { Worker_ID: id } });
};

export const updateWorker = async (id, data) => {
    return prisma.iTI_Workers.update({ where: { Worker_ID: id }, data });
};

export const deleteWorker = async (id) => {
    return prisma.iTI_Workers.delete({ where: { Worker_ID: id } });
};
