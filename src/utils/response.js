// src/utils/response.js
export const sendSuccess = (res, status, message, data) => {
    return res.status(status).json({ success: true, message, data });
};

export const sendError = (res, status, message, details) => {
    return res.status(status).json({ success: false, message, details });
};