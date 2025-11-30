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

export const findForScheduling = async (itiId) => {
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

export const updateLastUsedBulk = (machineIds) => {
    const updates = machineIds.map((id) =>
        prisma.machines.updateMany({
            where: { Machine_ID: id },
            data: { Last_used: new Date() },
        })
    );
    return updates; // This will be passed to prisma.$transaction in the service
};
