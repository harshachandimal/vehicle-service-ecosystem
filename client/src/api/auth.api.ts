import axios from 'axios';
import type { LoginRequest, RegisterRequest, BusinessRegisterRequest, AuthResponse } from '../types/auth.types';

/** Base API URL from environment variable or default to localhost */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Axios instance configured for API requests
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Authentication API methods
 */
export const authApi = {
    /**
     * Logs in a user with email and password
     * @param data - Login credentials
     * @returns Promise resolving to authentication response with token and user data
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    /**
     * Registers a new individual user
     * @param data - Registration details
     * @returns Promise resolving to authentication response with token and user data
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    /**
     * Registers a new business user
     * @param data - Business registration details
     * @returns Promise resolving to authentication response with token and user data
     */
    registerBusiness: async (data: BusinessRegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/register-business', data);
        return response.data;
    },

    /**
     * Requests a password reset token for the given email
     * @param email - The user's registered email address
     * @returns Promise resolving to a message and (in dev) the raw resetToken
     */
    forgotPassword: async (email: string): Promise<{ message: string; resetToken?: string }> => {
        const response = await api.post('/api/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Resets the user's password using a valid reset token
     * @param token - Raw reset token from the URL
     * @param newPassword - The new plain-text password
     * @returns Promise resolving to a success message
     */
    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
        const response = await api.post('/api/auth/reset-password', { token, newPassword });
        return response.data;
    },

    /**
     * Logs out the current user by removing auth data from localStorage
     */
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },
};

export default api;
