/**
 * Vehicle entity interface
 * Represents a vehicle owned by a user in the system
 */
export interface Vehicle {
    /** Unique identifier for the vehicle */
    id: string;
    /** ID of the user who owns this vehicle */
    ownerId: string;
    /** Vehicle manufacturer (e.g., Toyota, Honda) */
    make: string;
    /** Vehicle model name */
    model: string;
    /** Year of manufacture */
    year: number;
    /** Vehicle license plate number */
    licensePlate: string;
    /** Timestamp when the vehicle was created */
    createdAt: Date;
    /** Timestamp when the vehicle was last updated */
    updatedAt: Date;
}

/**
 * Data Transfer Object for creating a new vehicle
 * ownerId is not included as it will be extracted from authenticated user
 */
export interface CreateVehicleDTO {
    /** Vehicle manufacturer */
    make: string;
    /** Vehicle model name */
    model: string;
    /** Year of manufacture */
    year: number;
    /** Vehicle license plate number */
    licensePlate: string;
}

/**
 * Data Transfer Object for updating an existing vehicle
 * All fields are optional
 */
export interface UpdateVehicleDTO {
    /** Updated manufacturer */
    make?: string;
    /** Updated model name */
    model?: string;
    /** Updated year of manufacture */
    year?: number;
    /** Updated license plate number */
    licensePlate?: string;
}

/**
 * Vehicle with owner information
 * Used for detailed vehicle responses
 */
export interface VehicleWithOwner extends Vehicle {
    /** Owner's name */
    ownerName?: string;
    /** Owner's email */
    ownerEmail?: string;
}
