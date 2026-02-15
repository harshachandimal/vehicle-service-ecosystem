/**
 * Invoice status enumeration
 * Represents the payment status of an invoice
 */
export enum InvoiceStatus {
    /** Invoice has not been paid */
    UNPAID = 'UNPAID',
    /** Invoice has been paid */
    PAID = 'PAID',
}

/**
 * Invoice item interface
 * Represents a snapshot of a service item at the time of billing
 * Stored as JSONB to preserve historical pricing
 */
export interface InvoiceItem {
    /** Service name at time of billing */
    name: string;
    /** Service price at time of billing */
    price: number;
    /** Quantity of service units */
    quantity: number;
}

/**
 * Invoice entity interface
 * Represents a billing document for a completed booking
 */
export interface Invoice {
    /** Unique identifier for the invoice */
    id: string;
    /** ID of the associated booking (one-to-one) */
    bookingId: string;
    /** Total invoice amount calculated from items */
    amount: number;
    /** Current payment status of the invoice */
    status: InvoiceStatus;
    /** Service items snapshot (stored as JSONB) */
    items: InvoiceItem[];
    /** Timestamp when the invoice was created */
    createdAt: Date;
    /** Timestamp when the invoice was last updated */
    updatedAt: Date;
}

/**
 * DTO for creating a new invoice
 */
export interface CreateInvoiceDTO {
    /** ID of the booking to invoice */
    bookingId: string;
    /** Array of service items with pricing snapshot */
    items: InvoiceItem[];
}

/**
 * Invoice with related entity information
 */
export interface InvoiceWithDetails extends Invoice {
    /** Booking information */
    booking?: {
        serviceDate: Date;
        description: string;
        providerId: string; // For access control validation
    };
    /** Vehicle information */
    vehicle?: {
        make: string;
        model: string;
        licensePlate: string;
        ownerId: string; // For access control validation
    };
    /** Provider information */
    provider?: {
        name: string;
        businessName?: string;
    };
}
