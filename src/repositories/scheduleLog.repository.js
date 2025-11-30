// src/repositories/scheduleLog.repository.js
const prisma = require('../config/db');

exports.createManyWithMachineUpdates = async ({ logs, machineIds }) => {
    const now = new Date();
    const itiId = logs[0].ITI_ID;

    const result = await prisma.$transaction(async (tx) => {
        await tx.schedule_Logs.createMany({ data: logs });

        await Promise.all(
            machineIds.map((id) =>
                tx.machines.update({
                    where: { Machine_ID: id },
                    data: { Last_used: now },
                })
            )
        );

        const startOfDay = new Date(now.toDateString());

        return tx.schedule_Logs.findMany({
            where: {
                ITI_ID: itiId,
                Scheduled_On: { gte: startOfDay },
            },
            include: {
                student: true,
                machine: true,
                worker: true,
            },
            orderBy: { S_Log_ID: 'asc' },
        });
    });

    return result;
};

exports.findTodayByFilter = ({ itiId, tradeId, batch }) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.schedule_Logs.findMany({
        where: {
            ITI_ID: itiId,
            Scheduled_On: { gte: startOfDay },
            ...(tradeId && { student: { Trade_ID: tradeId } }),
            ...(batch && { student: { Batch: batch } }),
        },
        include: {
            student: true,
            machine: true,
            worker: true,
        },
        orderBy: { S_Log_ID: 'asc' },
    });
};