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
    /** Optional phone number */
    phone?: string;
    /** Optional district/region */
    district?: string;
    /** Optional city */
    city?: string;
}

/**
 * Business registration credentials
 * Data required for registering a service provider (creates User + ProviderProfile)
 */
export interface BusinessRegisterCredentials {
    /** Business email address */
    email: string;
    /** Password */
    password: string;
    /** Business name (stored as user.name) */
    name: string;
    /** Business phone number */
    phone?: string;
    /** Business district */
    district?: string;
    /** Business city */
    city?: string;
    /** Business display name for the profile */
    businessName: string;
    /** Service category */
    category: 'GARAGE' | 'CARRIER' | 'DETAILER';
    /** Street-level address */
    streetAddress?: string;
    /** Optional description */
    businessDescription?: string;
    /** Optional BR number */
    registrationNumber?: string;
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
