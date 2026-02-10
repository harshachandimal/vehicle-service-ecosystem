/**
 * Booking status enumeration
 * Represents the lifecycle states of a service booking
 */
export enum BookingStatus {
    /** Initial state when booking is created */
    PENDING = 'PENDING',
    /** Provider has accepted the booking */
    ACCEPTED = 'ACCEPTED',
    /** Provider has rejected the booking */
    REJECTED = 'REJECTED',
    /** Service is currently being performed */
    IN_PROGRESS = 'IN_PROGRESS',
    /** Service has been completed successfully */
    COMPLETED = 'COMPLETED',
    /** Booking was cancelled by owner */
    CANCELLED = 'CANCELLED',
}

/**
 * Booking entity interface
 * Represents a service booking in the system
 */
export interface Booking {
    /** Unique identifier for the booking */
    id: string;
    /** ID of the vehicle being serviced */
    vehicleId: string;
    /** ID of the service provider */
    providerId: string;
    /** Description of the service requested */
    description: string;
    /** Scheduled date for the service */
    serviceDate: Date;
    /** Current status of the booking */
    status: BookingStatus;
    /** Timestamp when the booking was created */
    createdAt: Date;
    /** Timestamp when the booking was last updated */
    updatedAt: Date;
}

/**
 * DTO for creating a new booking
 */
export interface CreateBookingDTO {
    /** ID of the vehicle to be serviced */
    vehicleId: string;
    /** ID of the provider to perform the service */
    providerId: string;
    /** Description of the service requested */
    description: string;
    /** Scheduled date for the service */
    serviceDate: Date;
}

/**
 * DTO for updating booking status
 */
export interface UpdateStatusDTO {
    /** New status to transition to */
    status: BookingStatus;
}

/**
 * Booking with related entity information
 */
export interface BookingWithDetails extends Booking {
    /** Vehicle information */
    vehicle?: {
        make: string;
        model: string;
        licensePlate: string;
        ownerName?: string;
    };
    /** Provider information */
    provider?: {
        name: string;
        email: string;
    };
}
