import { useState, useEffect } from 'react';
import { vehicleApi, type Vehicle } from '../api/vehicle.api';

export const useVehicleDetails = (id: string | undefined) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await vehicleApi.getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        setError('Failed to load vehicle details. The vehicle may not exist or you may not have permission to view it.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const updatePhoto = async (file: File) => {
    if (!id) return;

    try {
      setUploading(true);
      const updatedVehicle = await vehicleApi.uploadVehiclePhoto(id, file);
      setImageSuccess(true);
      setVehicle(updatedVehicle);
      setTimeout(() => setImageSuccess(false), 3000);
      return true;
    } catch (err) {
      setError('Failed to update vehicle photo.');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteVehicle = async () => {
    if (!id) return false;

    try {
      setLoading(true);
      await vehicleApi.deleteVehicle(id);
      return true;
    } catch (err) {
      setError('Failed to delete vehicle.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (data: Partial<Vehicle>) => {
    if (!id) return null;

    try {
      setLoading(true);
      const updatedVehicle = await vehicleApi.updateVehicle(id, data as any);
      setVehicle(updatedVehicle);
      return updatedVehicle;
    } catch (err) {
      setError('Failed to update vehicle details.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicle,
    loading,
    error,
    uploading,
    imageSuccess,
    updatePhoto,
    deleteVehicle,
    updateVehicle,
    setError
  };
};
