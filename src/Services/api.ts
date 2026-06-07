// src/services/api.ts
import { API_BASE_URL } from '../config/endpoints';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// GET request
export const get = async (endpoint: string, requiresAuth: boolean = true) => {
  const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// POST request
export const post = async (endpoint: string, body: object, requiresAuth: boolean = true) => {
  const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// PUT request
export const put = async (endpoint: string, body: object, requiresAuth: boolean = true) => {
  const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// DELETE request
export const del = async (endpoint: string, requiresAuth: boolean = true) => {
  const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE', headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};