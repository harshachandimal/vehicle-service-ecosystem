import React, { useState } from 'react';
import { 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameDay, 
    eachDayOfInterval,
    parseISO
} from 'date-fns';
import type { BookingResponse } from '../../../../api/booking.api';
import DayDetailModal from './DayDetailModal';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';

interface CalendarViewProps {
    bookings: BookingResponse[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getBookingsForDay = (day: Date) => {
        return bookings.filter(booking => {
            const bookingDate = parseISO(booking.serviceDate);
            return isSameDay(bookingDate, day) && (booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED');
        });
    };

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setIsDayModalOpen(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CalendarHeader 
                currentMonth={currentMonth}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                onToday={goToToday}
            />

            <CalendarGrid 
                calendarDays={calendarDays}
                monthStart={monthStart}
                selectedDate={selectedDate}
                getBookingsForDay={getBookingsForDay}
                onDayClick={handleDayClick}
            />
            
            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-6 px-4">
                <LegendItem color="bg-emerald-500" label="Confirmed" shadow="shadow-emerald-200" />
                <LegendItem color="bg-blue-500" label="In Progress" shadow="shadow-blue-200" />
                <LegendItem color="bg-slate-400" label="Completed" shadow="shadow-slate-100" />
            </div>

            {selectedDate && (
                <DayDetailModal
                    isOpen={isDayModalOpen}
                    onClose={() => setIsDayModalOpen(false)}
                    date={selectedDate}
                    bookings={bookings}
                />
            )}
        </div>
    );
};

const LegendItem = ({ color, label, shadow }: { color: string, label: string, shadow: string }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color} shadow-sm ${shadow}`}></div>
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</span>
    </div>
);

export default CalendarView;
