import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, BusinessRegisterRequest, AuthResponse } from '../types/auth.types';
import { authApi } from '../api/auth.api';

/**
 * Authentication context type definition
 */
interface AuthContextType {
    /** Current authenticated user or null if not logged in */
    user: User | null;
    /** JWT authentication token or null if not logged in */
    token: string | null;
    /** Loading state during initial auth check */
    loading: boolean;
    /** Login function */
    login: (data: LoginRequest) => Promise<void>;
    /** Register function for individual users */
    register: (data: RegisterRequest) => Promise<void>;
    /** Register function for business users */
    registerBusiness: (data: BusinessRegisterRequest) => Promise<void>;
    /** Logout function */
    logout: () => void;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 * @param props - Component props
 * @param props.children - Child components to wrap with auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Handles authentication response by updating state and localStorage
     * @param response - Authentication response from API
     */
    const handleAuthResponse = (response: AuthResponse) => {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    };

    /**
     * Logs in a user with the provided credentials
     * @param data - Login credentials
     */
    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        handleAuthResponse(response);
    };

    /**
     * Registers a new individual user
     * @param data - Registration details
     */
    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        handleAuthResponse(response);
    };

    /**
     * Registers a new business user
     * @param data - Business registration details
     */
    const registerBusiness = async (data: BusinessRegisterRequest) => {
        const response = await authApi.registerBusiness(data);
        handleAuthResponse(response);
    };

    /**
     * Logs out the current user
     */
    const logout = () => {
        authApi.logout();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, registerBusiness, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
