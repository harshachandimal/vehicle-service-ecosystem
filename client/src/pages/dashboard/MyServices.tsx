import { Navigate } from 'react-router-dom';
import { Plus, Search, ShieldCheck } from 'lucide-react';
import ProviderSidebar from '../../components/dashboard/layout/Sidebar';
import ServiceModal from '../../components/dashboard/services/ServiceModal';
import DeleteServiceConfirmModal from '../../components/dashboard/services/DeleteServiceConfirmModal';
import ServiceRow from '../../components/dashboard/services/ServiceRow';
import { useMyServices } from '../../hooks/useMyServices';
import { useAuth } from '../../hooks/useAuth';

export default function MyServices() {
    const { token, loading: authLoading, user } = useAuth();
    const {
        services,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        editingService,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        serviceToDelete,
        handleAddService,
        handleEditService,
        handleDeleteClick,
        handleSaveService,
        confirmDelete
    } = useMyServices();

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!token || user?.role !== 'PROVIDER') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-100">
            <ProviderSidebar />

            <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto relative z-0">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Services</h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage your service catalog and pricing.</p>
                    </div>
                    <button
                        onClick={handleAddService}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" /> Add New Service
                    </button>
                </header>

                <div className="mb-8">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-16">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50/80 backdrop-blur-md text-red-600 p-6 rounded-2xl border border-red-100 text-center shadow-sm">
                        {error}
                    </div>
                ) : services.length === 0 ? (
                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-12 border border-dashed border-slate-300 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No services found</h3>
                        <p className="text-slate-500 mt-2">Get started by adding your first service item.</p>
                        <button
                            onClick={handleAddService}
                            className="mt-6 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                        >
                            + Add Service
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {services.map((service) => (
                            <ServiceRow
                                key={service.id}
                                service={service}
                                onEdit={handleEditService}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveService}
                service={editingService}
            />

            <DeleteServiceConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                serviceName={serviceToDelete?.name || ''}
            />
        </div>
    );
}
