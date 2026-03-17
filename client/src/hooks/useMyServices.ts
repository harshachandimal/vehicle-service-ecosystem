import { useState, useEffect, useMemo } from 'react';
import { providersApi, type ProviderService } from '../api/providers.api';
import { useAuth } from './useAuth';

export function useMyServices() {
    const { user, token } = useAuth();
    const [services, setServices] = useState<ProviderService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ProviderService | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<ProviderService | null>(null);

    const fetchServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await providersApi.getMyProfile();
            setServices(data.services);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch services');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && user?.role === 'PROVIDER') {
            fetchServices();
        }
    }, [token, user?.role]);

    const handleAddService = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleEditService = (service: ProviderService) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (service: ProviderService) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const handleSaveService = async (data: any) => {
        try {
            if (editingService) {
                await providersApi.updateService(editingService.id, data);
            } else {
                await providersApi.addService(data);
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (err: any) {
            throw err;
        }
    };

    const confirmDelete = async () => {
        if (!serviceToDelete) return;
        try {
            await providersApi.deleteService(serviceToDelete.id);
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
            fetchServices();
        } catch (err: any) {
            throw err;
        }
    };

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;
        const query = searchQuery.toLowerCase();
        return services.filter(s => 
            s.name.toLowerCase().includes(query) ||
            (s.description || '').toLowerCase().includes(query) ||
            (s.vehicleType || '').toLowerCase().includes(query)
        );
    }, [services, searchQuery]);

    return {
        services: filteredServices,
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
        confirmDelete,
        refreshServices: fetchServices
    };
}
