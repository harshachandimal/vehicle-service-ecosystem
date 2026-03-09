import { CheckCircle } from 'lucide-react';

export default function BookingSuccess() {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your service has been requested successfully.</p>
            <p className="text-sm text-gray-500 animate-pulse">Redirecting to home...</p>
        </div>
    );
}
