import { BookingStatus } from '../types/booking.types';

/**
 * Valid status transitions map
 * Defines which status transitions are allowed in the booking state machine
 */
const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    [BookingStatus.PENDING]: [
        BookingStatus.ACCEPTED,
        BookingStatus.REJECTED,
        BookingStatus.CANCELLED,
    ],
    [BookingStatus.ACCEPTED]: [
        BookingStatus.IN_PROGRESS,
        BookingStatus.CANCELLED,
    ],
    [BookingStatus.REJECTED]: [],
    [BookingStatus.IN_PROGRESS]: [
        BookingStatus.COMPLETED,
    ],
    [BookingStatus.COMPLETED]: [],
    [BookingStatus.CANCELLED]: [],
};

/**
 * Validate if a status transition is allowed
 * 
 * @param {BookingStatus} currentStatus - The current booking status
 * @param {BookingStatus} newStatus - The target status to transition to
 * @returns {boolean} True if transition is valid
 * 
 * @example
 * isValidTransition(BookingStatus.PENDING, BookingStatus.ACCEPTED); // true
 * isValidTransition(BookingStatus.PENDING, BookingStatus.COMPLETED); // false
 */
export function isValidTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus
): boolean {
    return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Validate status transition and throw error if invalid
 * 
 * @param {BookingStatus} currentStatus - The current booking status
 * @param {BookingStatus} newStatus - The target status to transition to
 * @throws {Error} If transition is not allowed
 */
export function validateStatusTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus
): void {
    if (!isValidTransition(currentStatus, newStatus)) {
        throw new Error(
            `Invalid status transition: ${currentStatus} → ${newStatus}`
        );
    }
}

/**
 * Get allowed next statuses for a given current status
 * 
 * @param {BookingStatus} currentStatus - The current booking status
 * @returns {BookingStatus[]} Array of valid next statuses
 */
export function getAllowedTransitions(currentStatus: BookingStatus): BookingStatus[] {
    return VALID_TRANSITIONS[currentStatus] ?? [];
}
