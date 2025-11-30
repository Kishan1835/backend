// src/repositories/students.repository.js
import prisma from '../config/prismaClient.js';

export const findByBatch = ({ itiId, tradeId, batch }) => {
    return prisma.students.findMany({
        where: {
            ITI_ID: itiId,
            Trade_ID: tradeId,
            Batch: batch,
        },
        orderBy: { Student_ID: 'asc' },
    });
};