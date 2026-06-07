// src/config/endpoint.ts

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  TRACKING: {
    TRACK: (trackingNumber: string) => `/track/${trackingNumber}`,
    SCAN: (trackingNumber: string) => `/scan/${trackingNumber}`,
    CREATE_SHIPMENT: '/shipments',
    MY_SHIPMENTS: '/my-shipments',
  },
};