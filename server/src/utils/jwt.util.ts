import jwt from 'jsonwebtoken';
import { AuthPayload, TokenPayload } from '../types/auth.types';

/** JWT secret key from environment or default for development */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/** Token expiration time */
const TOKEN_EXPIRY = '24h';

/**
 * Generate a JWT token for a user
 * 
 * @param {AuthPayload} payload - The payload to encode in the token
 * @returns {string} The generated JWT token
 * 
 * @example
 * const token = generateToken({ userId: '123', email: 'user@example.com', role: UserRole.OWNER });
 */
export function generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 * 
 * @param {string} token - The JWT token to verify
 * @returns {TokenPayload | null} The decoded payload if valid, null otherwise
 * 
 * @example
 * const payload = verifyToken(token);
 * if (payload) {
 *   console.log(payload.userId);
 * }
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}
