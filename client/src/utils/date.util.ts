export function isServiceTimePassed(serviceDateStr: Date | string, timeSlot?: string | null): boolean {
    const serviceDate = new Date(serviceDateStr);
    if (isNaN(serviceDate.getTime())) return true; // fallback

    // Extract exactly the YYYY-MM-DD components since dates are saved as UTC at 00:00 
    const year = serviceDate.getUTCFullYear();
    const month = serviceDate.getUTCMonth();
    const dateVal = serviceDate.getUTCDate();

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
