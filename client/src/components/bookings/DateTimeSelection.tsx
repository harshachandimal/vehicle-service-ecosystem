import { Calendar, Clock } from 'lucide-react';

interface DateTimeSelectionProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    selectedTimeSlot: string;
    onTimeSlotChange: (time: string) => void;
    timeSlots: string[];
}

export default function DateTimeSelection({
    selectedDate,
    onDateChange,
    selectedTimeSlot,
    onTimeSlotChange,
    timeSlots
}: DateTimeSelectionProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 font-semibold text-dark">
                    <Calendar size={18} className="text-primary" />
                    Service Date
                </div>
                <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/30 outline-none"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                />
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 font-semibold text-dark">
                    <Clock size={18} className="text-primary" />
                    Time Slot
                </div>
                <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/30 outline-none"
                    value={selectedTimeSlot}
                    onChange={(e) => onTimeSlotChange(e.target.value)}
                    required
                >
                    <option value="" disabled>Select time...</option>
                    {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
