/**
 * User role enumeration
 * Defines the available roles within the Vehicle Service Ecosystem
 */
export enum UserRole {
    /** Vehicle owner who can request services */
    OWNER = 'OWNER',
    /** Service provider who can offer services */
    PROVIDER = 'PROVIDER',
}

/**
 * User entity interface
 * Represents a user in the system
 */
export interface User {
    /** Unique identifier for the user */
    id: string;
    /** User's email address (unique) */
    email: string;
    /** User's full name */
    name: string;
    /** User's role in the system */
    role: UserRole;
    /** Timestamp when the user was created */
    createdAt: Date;
    /** Timestamp when the user was last updated */
    updatedAt: Date;
}

/**
 * Data Transfer Object for creating a new user
 */
export interface CreateUserDTO {
    /** User's email address */
    email: string;
    /** User's password (will be hashed) */
    password: string;
    /** User's full name */
    name: string;
    /** User's role */
    role: UserRole;
}

/**
 * Data Transfer Object for updating an existing user
 * All fields are optional
 */
export interface UpdateUserDTO {
    /** Updated email address */
    email?: string;
    /** Updated full name */
    name?: string;
    /** Updated role */
    role?: UserRole;
}

/**
 * User interface without sensitive information
 * Used for API responses
 */
export interface SafeUser {
    /** Unique identifier for the user */
    id: string;
    /** User's email address */
    email: string;
    /** User's full name */
    name: string;
    /** User's role in the system */
    role: UserRole;
    /** Timestamp when the user was created */
    createdAt: Date;
    /** Timestamp when the user was last updated */
    updatedAt: Date;
}
