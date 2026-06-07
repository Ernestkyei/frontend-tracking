// src/services/api.ts
import { API_BASE_URL } from '../config/endpoints';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getPublicHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
  };
};

export const get = async <T>(
  endpoint: string, 
  requiresAuth: boolean = true
): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data as T;
};

export const post = async <T>(
  endpoint: string, 
  body: object | null, 
  requiresAuth: boolean = true
): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data as T;
};

export const put = async <T>(
  endpoint: string, 
  body: object | null, 
  requiresAuth: boolean = true
): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data as T;
};

export const patch = async <T>(
  endpoint: string, 
  body: object | null, 
  requiresAuth: boolean = true
): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data as T;
};

export const del = async <T>(
  endpoint: string, 
  requiresAuth: boolean = true
): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : getPublicHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE', headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data as T;
};