import prisma from '../config/prismaClient.js';

export const createITI = async (data) => {
    return prisma.iTI.create({ data });
};

export const getAllITIs = async () => {
    return prisma.iTI.findMany();
};

export const getITIById = async (id) => {
    return prisma.iTI.findUnique({ where: { ITI_ID: id } });
};

export const updateITI = async (id, data) => {
    return prisma.iTI.update({ where: { ITI_ID: id }, data });
};

export const deleteITI = async (id) => {
    return prisma.iTI.delete({ where: { ITI_ID: id } });
};
