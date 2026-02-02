import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt.util';
import { AuthPayload } from '../../types/auth.types';
import { UserRole } from '../../types/user.types';

/**
 * Extended Express Request interface with authenticated user payload
 */
export interface AuthenticatedRequest extends Request {
    /** Authenticated user payload from JWT */
    user?: AuthPayload;
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 * 
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
    }

    req.user = payload;
    next();
}

/**
 * Authorization middleware factory
 * Creates middleware that checks if user has required role(s)
 * 
 * @param {UserRole[]} allowedRoles - Array of roles allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.post('/vehicles', authenticate, authorize([UserRole.OWNER]), handler);
 */
export function authorize(allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required.' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            return;
        }

        next();
    };
}
