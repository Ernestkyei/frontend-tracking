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
  recipientName?: string;
  recipientPhone?: string;
  senderName?: string;
  senderPhone?: string;
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
  
  customerName: string;      
  customerEmail: string;     
  pickupAddress: string;
  deliveryAddress: string;
  customerPhone?: string;    
  recipientPhone?: string;
  description?: string;
  weight?: number;
  price?: number;
  expectedDelivery?: string;
}