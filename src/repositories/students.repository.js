const prisma = require('../../src/config/db');

exports.findByBatch = async (itiId, tradeId, batch) => {
    return prisma.students.findMany({
        where: {
            ITI_ID: itiId,
            Trade_ID: tradeId,
            Batch: batch,
        },
    });
};
