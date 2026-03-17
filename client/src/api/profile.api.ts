import api from './auth.api';

/**
 * Profile API methods
 */
export const profileApi = {
    /**
     * Fetches current user's profile information
     * @returns Promise resolving to user profile data (with providerProfile if provider)
     */
    getProfile: async () => {
        const response = await api.get('/api/profile');
        return response.data;
    },

    /**
     * Updates profile information
     * @param data - Profile update data (User + ProviderProfile fields)
     * @returns Promise resolving to success message
     */
    updateProfile: async (data: any) => {
        const response = await api.patch('/api/profile', data);
        return response.data;
    },

    /**
     * Changes user password
     * @param data - Current and new password
     * @returns Promise resolving to success message
     */
    changePassword: async (data: any) => {
        const response = await api.patch('/api/profile/password', data);
        return response.data;
    },

    /**
     * Uploads provider profile photo
     * @param formData - FormData containing the 'photo' file
     * @returns Promise resolving to the new photoUrl
     */
    uploadPhoto: async (formData: FormData) => {
        const response = await api.post('/api/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
