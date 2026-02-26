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
     * Logs out the current user by removing auth data from localStorage
     */
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },
};

export default api;
