// src/services/authService.ts
import { get, post, put } from './api';
import { API_ENDPOINTS } from '../config/endpoints';
import type { 
  ApiResponse, 
  AuthResponseData, 
  User, 
  LoginCredentials, 
  RegisterData
} from './types';

export const authService = {
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponseData>> => {
    try {
      const response = await post<ApiResponse<AuthResponseData>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
        false
      );
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Registration failed',
        { cause: error }
      );
    }
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> => {
    try {
      const response = await post<ApiResponse<AuthResponseData>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        false
      );
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Login failed',
        { cause: error }
      );
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await get<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE, true);
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to load profile',
        { cause: error }
      );
    }
  },

  
  updateProfile: async (data: { name: string; phone?: string }): Promise<ApiResponse<User>> => {
    try {
      const response = await put<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        data,
        true
      );
      
      // Update localStorage with the new user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update profile',
        { cause: error }
      );
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await put<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        { currentPassword, newPassword },
        true
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to change password',
        { cause: error }
      );
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_profile'); 
    localStorage.removeItem('recent_shipments'); 
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};