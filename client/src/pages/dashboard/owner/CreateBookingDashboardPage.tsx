import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import CreateBookingPage from '../../bookings/CreateBookingPage';

export default function CreateBookingDashboardPage() {
    return (
        <div className="flex min-h-screen bg-[#020617]">
            <OwnerSidebar />
            
            <main className="flex-1 h-screen overflow-y-auto relative">
                <CreateBookingPage isDashboard={true} />
            </main>
        </div>
    );
}
