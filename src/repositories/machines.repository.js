import prisma from '../config/prismaClient.js';
import { MachineStatus } from '@prisma/client';

export const createMachine = async (data) => {
    return prisma.machines.create({ data });
};

export const getAllMachines = async () => {
    return prisma.machines.findMany();
};

export const getMachineById = async (id) => {
    return prisma.machines.findUnique({ where: { Machine_ID: id } });
};

export const updateMachine = async (id, data) => {
    return prisma.machines.update({ where: { Machine_ID: id }, data });
};

export const deleteMachine = async (id) => {
    return prisma.machines.delete({ where: { Machine_ID: id } });
};

export const findForScheduling = async (itiId, allowedStatuses = [MachineStatus.HEALTHY]) => {
    return prisma.machines.findMany({
        where: {
            ITI_ID: itiId,
            Status: {
                in: allowedStatuses,
            },
            Reserved: false,
        },
        orderBy: {
            Last_used: 'asc',
        },
    });
};

// Try to reserve a machine. Returns number of updated rows (1 if reserved, 0 if already reserved)
export const reserveMachine = async (machineId) => {
    const res = await prisma.machines.updateMany({
        where: { Machine_ID: machineId, Reserved: false },
        data: { Reserved: true },
    });
    return res.count;
};

// Release a reservation on a machine (set Reserved = false)
export const releaseMachine = async (machineId) => {
    return prisma.machines.updateMany({ where: { Machine_ID: machineId }, data: { Reserved: false } });
};

export const updateLastUsedBulk = (machineIds) => {
    const updates = machineIds.map((id) =>
        prisma.machines.updateMany({
            where: { Machine_ID: id },
            data: { Last_used: new Date() },
        })
    );
    return updates; // This will be passed to prisma.$transaction in the service
};
