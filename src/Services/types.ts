// src/services/types.ts

export interface ApiResponse<T = unknown> {
  user: any;
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  currentLocation?: string;
  pickupAddress: string;
  deliveryAddress: string;
  expectedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  packageType: string;
  weight: number;
  description?: string;
  // Sender fields
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  // Recipient fields
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  locationUpdates?: LocationUpdate[];
}

export interface LocationUpdate {
  id: string;
  location: string;
  status: string;
  note?: string;
  timestamp: string;
}

export interface CreateShipmentData {
  // Sender fields (new)
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  // Legacy fallbacks (backend accepts both)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  // Recipient fields ← were missing before
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  // Package & address fields
  pickupAddress: string;
  deliveryAddress: string;
  description?: string;
  weight?: number;
  price?: number;
  expectedDelivery?: string;
}