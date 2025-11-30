import jwt from 'jsonwebtoken';
import { logAction } from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        logAction('System', null, 'Authentication Failed', { reason: 'No token provided' });
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            logAction('System', null, 'Authentication Failed', { reason: 'Invalid token', error: err.message });
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
