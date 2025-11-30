import prisma from '../config/prismaClient.js';

export const logAction = async (actorType, actorId, action, details) => {
    try {
        // In a real application, you'd have a dedicated logging table.
        // For simplicity, we'll just log to console for now, and you can extend this to a database table if needed.
        console.log(`ANALYTICS LOG: [${new Date().toISOString()}] Actor: ${actorType} (ID: ${actorId}), Action: ${action}, Details: ${JSON.stringify(details)}`);
        // Example of how you might log to a database table named 'Analytics_Log'
        // await prisma.analytics_Log.create({
        //     data: {
        //         Actor_Type: actorType,
        //         Actor_ID: actorId,
        //         Action: action,
        //         Details: JSON.stringify(details),
        //         Timestamp: new Date(),
        //     },
        // });
    } catch (error) {
        console.error('Error logging action:', error);
    }
};
