import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ServiceSummaryCard from '../../components/bookings/ServiceSummaryCard';
import VehicleSelection from '../../components/bookings/VehicleSelection';
import DateTimeSelection from '../../components/bookings/DateTimeSelection';
import BookingNotes from '../../components/bookings/BookingNotes';
import BookingSuccess from '../../components/bookings/BookingSuccess';
import { useCreateBooking } from './useCreateBooking';

// Time slots available for booking
const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function CreateBookingPage() {
    const { serviceId } = useParams<{ serviceId: string }>();
    const {
        isLoading,
        isSubmitting,
        error,
        success,
        service,
        vehicles,
        noVehiclesError,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedDate,
        setSelectedDate,
        selectedTimeSlot,
        setSelectedTimeSlot,
        notes,
        setNotes,
        handleSubmit
    } = useCreateBooking(serviceId);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (error && !service) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
                <Link to="/services" className="text-white hover:text-primary flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Services
                </Link>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen py-10 px-4"
            style={{
                backgroundImage: `url('/Gemini_Generated_Image_5k4jyd5k4jyd5k4j (1).png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="min-h-screen bg-white/70 backdrop-blur-sm absolute inset-0 -z-10" />

            <div className="max-w-3xl mx-auto">
                <Link to="/services" className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors">
                    <ArrowLeft size={18} /> Back to Services
                </Link>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50">
                    <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                        <h1 className="text-2xl font-bold mb-1">Complete Your Booking</h1>
                        <p className="opacity-90 text-sm">Fill in the details below to schedule your service</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {success ? (
                            <BookingSuccess />
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <ServiceSummaryCard service={service} />

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {noVehiclesError && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl mb-6">
                                        <h3 className="font-semibold mb-1">No Vehicles Found</h3>
                                        <p className="text-sm">You need to add a vehicle to your profile before you can book a service. Please go to your dashboard to add a vehicle.</p>
                                    </div>
                                )}

                                <VehicleSelection
                                    vehicles={vehicles}
                                    selectedVehicleId={selectedVehicleId}
                                    onVehicleSelect={setSelectedVehicleId}
                                />

                                <DateTimeSelection
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                    selectedTimeSlot={selectedTimeSlot}
                                    onTimeSlotChange={setSelectedTimeSlot}
                                    timeSlots={TIME_SLOTS}
                                />

                                <BookingNotes
                                    notes={notes}
                                    onNotesChange={setNotes}
                                />

                                <button
                                    type="submit"
                                    className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
                                    disabled={isSubmitting || noVehiclesError || !selectedVehicleId}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="animate-spin" /> Confirming...</>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
