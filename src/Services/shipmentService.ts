// src/services/shipmentService.ts
import { get, post } from './api';
import { API_ENDPOINTS } from '../config/endpoints';

export interface CreateShipmentData {
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  pickupAddress: string;
  pickupRegion?: string;
  preferredPickupTime?: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  deliveryAddress: string;
  deliveryRegion: string;
  landmark?: string;
  packageType: string;
  estimatedWeight: string;
  estimatedValue?: string;
  packageDescription: string;
  specialInstructions?: string;
  deliveryUrgency: string;
  additionalNotes?: string;
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
}

export const shipmentService = {
  // Public - no auth required
  trackShipment: async (trackingNumber: string): Promise<Shipment> => {
    return await get<Shipment>(
      API_ENDPOINTS.TRACKING.TRACK(trackingNumber),
      false
    );
  },

  // Customer only - requires auth
  createShipment: async (data: CreateShipmentData): Promise<{ trackingNumber: string }> => {
    return await post(API_ENDPOINTS.TRACKING.CREATE_SHIPMENT, data, true);
  },

  getMyShipments: async (): Promise<Shipment[]> => {
    return await get(API_ENDPOINTS.TRACKING.MY_SHIPMENTS, true);
  },
};