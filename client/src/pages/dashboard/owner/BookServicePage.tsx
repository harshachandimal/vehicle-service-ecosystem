import OwnerSidebar from '../../../components/dashboard/owner/layout/OwnerSidebar';
import ServicesPage from '../../ServicesPage';

export default function BookServicePage() {
    return (
        <div className="flex min-h-screen bg-[#020617]">
            <OwnerSidebar />
            
            <main className="flex-1 h-screen overflow-y-auto relative">
                {/* ServicesPage content */}
                <ServicesPage />
                
                {/* Optional: Add a dark overlay or adjustment if ServicesPage colors clash, 
                    but as requested, we just show it without global nav/footer.
                    The ServicesPage already has its own background/overlay logic.
                */}
            </main>
        </div>
    );
}
