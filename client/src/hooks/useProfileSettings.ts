import { useState, useEffect } from 'react';
import { profileApi } from '../api/profile.api';
import { useAuth } from './useAuth';

export function useProfileSettings() {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        district: '',
        city: '',
        businessName: '',
        category: '',
        streetAddress: '',
        businessDescription: '',
        registrationNumber: '',
        photoUrl: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileApi.getProfile();
            setProfileData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                district: data.district || '',
                city: data.city || '',
                businessName: data.providerProfile?.businessName || '',
                category: data.providerProfile?.category || '',
                streetAddress: data.providerProfile?.streetAddress || '',
                businessDescription: data.providerProfile?.businessDescription || '',
                registrationNumber: data.providerProfile?.registrationNumber || '',
                photoUrl: data.providerProfile?.photoUrl || '',
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        setMessage(null);
        try {
            const result = await profileApi.uploadPhoto(formData);
            setProfileData((prev) => ({ ...prev, photoUrl: result.photoUrl }));
            setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Photo upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload photo.' });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await profileApi.updateProfile(profileData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            await profileApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            const errorMsg = (error as any).response?.data?.error || 'Failed to change password.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    const isProvider = authUser?.role === 'PROVIDER';

    return {
        loading,
        saving,
        uploading,
        message,
        profileData,
        setProfileData,
        passwordData,
        setPasswordData,
        handlePhotoUpload,
        handleProfileSubmit,
        handlePasswordSubmit,
        isProvider,
    };
}
