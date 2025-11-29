const prisma = require('../../src/config/db');
const { MachineStatus } = require('@prisma/client');

exports.findForScheduling = async (itiId) => {
    return prisma.machines.findMany({
        where: {
            ITI_ID: itiId,
            Status: {
                in: [MachineStatus.HEALTHY, MachineStatus.ALERT],
            },
        },
        orderBy: {
            Last_used: 'asc',
        },
    });
};

exports.updateLastUsedBulk = (machineIds) => {
    const updates = machineIds.map((id) =>
        prisma.machines.updateMany({
            where: { Machine_ID: id },
            data: { Last_used: new Date() },
        })
    );
    return updates; // This will be passed to prisma.$transaction in the service
};
