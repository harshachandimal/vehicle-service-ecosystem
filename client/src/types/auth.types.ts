/**
 * Represents a user in the system
 */
export interface User {
    /** Unique user identifier */
    id: string;
    /** User's email address */
    email: string;
    /** User's full name */
    name: string;
    /** User's role in the system */
    role: 'OWNER' | 'PROVIDER' | 'ADMIN';
    /** Optional phone number */
    phone?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
}

/**
 * Registration request payload for individual users
 */
export interface RegisterRequest {
    /** User's full name */
    name: string;
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
    /** Optional phone number */
    phone?: string;
    /** Optional district/region */
    district?: string;
    /** Optional city */
    city?: string;
    /** User role (OWNER or PROVIDER) */
    role: 'OWNER' | 'PROVIDER';
}

/**
 * Registration request payload for business users (extends RegisterRequest)
 */
export interface BusinessRegisterRequest extends RegisterRequest {
    /** Business name */
    businessName: string;
    /** Service category */
    category: 'GARAGE' | 'CARRIER' | 'DETAILER';
    /** Optional street address */
    streetAddress?: string;
    /** Optional business description */
    businessDescription?: string;
    /** Optional business registration number */
    registrationNumber?: string;
}

/**
 * Authentication response containing token and user data
 */
export interface AuthResponse {
    /** JWT authentication token */
    token: string;
    /** Authenticated user object */
    user: User;
}
