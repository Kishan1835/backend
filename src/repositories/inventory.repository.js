import prisma from '../config/prismaClient.js';

export const createItem = async (data) => {
    return prisma.inventory.create({ data });
};

export const getAllItems = async () => {
    return prisma.inventory.findMany();
};

export const getItemById = async (id) => {
    return prisma.inventory.findUnique({ where: { Item_ID: id } });
};

export const updateItem = async (id, data) => {
    return prisma.inventory.update({ where: { Item_ID: id }, data });
};

export const deleteItem = async (id) => {
    return prisma.inventory.delete({ where: { Item_ID: id } });
};

export const checkReorderLevel = async () => {
    return prisma.inventory.findMany({
        where: {
            Quantity: { lte: prisma.inventory.fields.Reorder_Level },
        },
    });
};
