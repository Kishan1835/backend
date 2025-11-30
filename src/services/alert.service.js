export const sendFaultAlert = async (machineId, status) => {
    // In a real application, this would involve:
    // 1. Sending notifications (email, SMS, push notification) to relevant personnel (e.g., ATO, MaintenanceWorker)
    // 2. Logging the alert in a dedicated alert system

    console.log(`Fault Alert: Machine ${machineId} is in ${status} status.`);
    // Simulate sending an email or other notification
    return { success: true, message: `Alert sent for Machine ${machineId}` };
};
