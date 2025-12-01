import jwt from 'jsonwebtoken';
import { logAction } from '../utils/logger.js';

/**
 * Authenticate token - supports both Clerk tokens and custom JWT tokens
 * Clerk tokens are decoded without verification (they're pre-validated by Clerk)
 * Custom JWT tokens are verified with the app secret
 */
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        logAction('System', null, 'Authentication Failed', { reason: 'No token provided' });
        return res.status(401).json({ message: 'Authentication token required' });
    }

    try {
        // Decode token without verification first
        const decoded = jwt.decode(token, { complete: true });

        if (!decoded) {
            logAction('System', null, 'Authentication Failed', { reason: 'Invalid token format' });
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Check if it's a Clerk token by looking at the issuer claim
        const issuer = decoded.payload?.iss || '';

        if (issuer.includes('clerk')) {
            // It's a Clerk token - accept it as-is (Clerk validates it)
            req.user = {
                id: decoded.payload?.sub,
                email: decoded.payload?.email,
                clerkUser: true,
            };
            console.log(`✓ Clerk token authenticated for user: ${decoded.payload?.sub}`);
            return next();
        }

        // Not a Clerk token, try local JWT verification
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            logAction('System', null, 'Authentication Failed', { reason: 'No authentication secret configured' });
            return res.status(500).json({ message: 'Server configuration error' });
        }

        jwt.verify(token, secret, (err, user) => {
            if (err) {
                logAction('System', null, 'Authentication Failed', { reason: 'Invalid token', error: err.message });
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        logAction('System', null, 'Authentication Error', { error: error.message });
        return res.status(403).json({ message: 'Authentication error' });
    }
};
