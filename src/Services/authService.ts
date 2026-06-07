// src/services/authService.ts
import { get, post, put } from './api';
import { API_ENDPOINTS } from '../config/endpoints';

export const authService = {
  // Register new user
  register: async (data: { name: string; email: string; phone?: string; password: string }) => {
    try {
      const response = await post(API_ENDPOINTS.AUTH.REGISTER, data, false);
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      // ✅ Preserve the original error cause
      throw new Error(error instanceof Error ? error.message : 'Registration failed', { cause: error });
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await post(API_ENDPOINTS.AUTH.LOGIN, credentials, false);
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      // ✅ Preserve the original error cause
      throw new Error(error instanceof Error ? error.message : 'Login failed', { cause: error });
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.PROFILE, true);
      return response.data || response;
    } catch (error) {
      // ✅ Preserve the original error cause
      throw new Error(error instanceof Error ? error.message : 'Failed to load profile', { cause: error });
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword }, true);
      return response;
    } catch (error) {
      // ✅ Preserve the original error cause
      throw new Error(error instanceof Error ? error.message : 'Failed to change password', { cause: error });
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },
};