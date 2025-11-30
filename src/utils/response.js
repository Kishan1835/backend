// src/utils/response.js
exports.sendSuccess = (res, status, message, data) => {
    return res.status(status).json({ success: true, message, data });
};

exports.sendError = (res, status, message, details) => {
    return res.status(status).json({ success: false, message, details });
};