import prisma from '../config/prismaClient.js';

export const createTrade = async (data) => {
    return prisma.trades.create({ data });
};

export const getAllTrades = async () => {
    return prisma.trades.findMany();
};

export const getTradeById = async (id) => {
    return prisma.trades.findUnique({ where: { Trade_ID: id } });
};

export const updateTrade = async (id, data) => {
    return prisma.trades.update({ where: { Trade_ID: id }, data });
};

export const deleteTrade = async (id) => {
    return prisma.trades.delete({ where: { Trade_ID: id } });
};
