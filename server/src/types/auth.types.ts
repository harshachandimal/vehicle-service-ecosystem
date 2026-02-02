import { UserRole } from './user.types';

/**
 * Authentication payload
 * Contains user information for JWT token or session
 */
export interface AuthPayload {
    /** User's unique identifier */
    userId: string;
    /** User's email address */
    email: string;
    /** User's role in the system */
    role: UserRole;
}

/**
 * Login credentials
 * Data required for user authentication
 */
export interface LoginCredentials {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
}

/**
 * Registration credentials
 * Data required for new user registration
 */
export interface RegisterCredentials {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
    /** User's full name */
    name: string;
    /** User's role in the system */
    role: UserRole;
}

/**
 * Authentication response
 * Returned after successful login or registration
 */
export interface AuthResponse {
    /** JWT token or session identifier */
    token: string;
    /** User information without sensitive data */
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
    };
}

/**
 * Token verification result
 * Contains decoded token information
 */
export interface TokenPayload extends AuthPayload {
    /** Token issued at timestamp */
    iat?: number;
    /** Token expiration timestamp */
    exp?: number;
}
