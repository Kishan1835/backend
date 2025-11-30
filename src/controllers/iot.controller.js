import prisma from '../config/prismaClient.js';
import { predictFaultProbability } from '../services/prediction.service.js';
import { sendFaultAlert } from '../services/alert.service.js';
import { assignMaintenanceTask } from './maintenance.controller.js';
import schedulingService from '../services/scheduling.service.js';

export const receiveSensorData = async (req, res) => {
    const { machineId, vibration, temp, current } = req.body;
    try {
        console.log(`Received sensor data for Machine ID: ${machineId}`);
        console.log(`Vibration: ${vibration}, Temperature: ${temp}, Current: ${current}`);

        const { faultProbability, status } = predictFaultProbability(vibration, temp, current);

        await prisma.machines.update({
            where: {
                Machine_ID: parseInt(machineId),
            },
            data: {
                Status: status,
                Faults: { increment: status === 'CRITICAL' ? 1 : 0 },
            },
        });

        if (status === 'CRITICAL') {
            await sendFaultAlert(machineId, status);
            await assignMaintenanceTask(parseInt(machineId), 'Critical fault detected', status); // Assign maintenance task
        }

        // If a machine degrades to ALERT or CRITICAL, ensure it is not reserved/used by scheduling.
        // Release reservation in case sensors flag issues (defensive).
        if (status !== 'HEALTHY') {
            try {
                await schedulingService.autoReleaseMachineReservation?.(parseInt(machineId));
            } catch (e) {
                // non-fatal
                console.warn('failed to release reservation for machine', machineId, e.message);
            }
        }

        res.status(200).json({ message: 'Sensor data received and machine status updated', faultProbability, status });
    } catch (error) {
        console.error('Error receiving sensor data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
