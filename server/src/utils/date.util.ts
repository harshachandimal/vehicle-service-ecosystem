/**
 * Utility to check if a service time has already passed
 * 
 * @param {Date | string} serviceDate - The scheduled date of the service
 * @param {string | null} timeSlot - The scheduled time slot (e.g., "09:00 AM")
 * @returns {boolean} True if the time has already passed
 */
export function isServiceTimePassed(serviceDate: Date | string, timeSlot?: string | null): boolean {
    const dateObj = new Date(serviceDate);
    if (isNaN(dateObj.getTime())) return true; // fallback

    // Extract date components
    let year: number, month: number, dateVal: number;
    
    if (typeof serviceDate === 'string' && serviceDate.includes('T')) {
        // If it's an ISO string, use UTC to avoid timezone shifts for the date part
        year = dateObj.getUTCFullYear();
        month = dateObj.getUTCMonth();
        dateVal = dateObj.getUTCDate();
    } else {
        // Otherwise use local components
        year = dateObj.getFullYear();
        month = dateObj.getMonth();
        dateVal = dateObj.getDate();
    }

    const scheduledTime = new Date(year, month, dateVal);
    
    if (timeSlot) {
        const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const ampm = match[3].toUpperCase();
            
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            
            scheduledTime.setHours(hours, minutes, 0, 0);
        }
    } else {
        scheduledTime.setHours(0, 0, 0, 0);
    }

    return new Date() >= scheduledTime;
}
