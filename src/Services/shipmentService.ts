// src/services/shipmentService.ts
import { get, post } from './api';
import { API_ENDPOINTS } from '../config/endpoints';
import type { ApiResponse, Shipment, CreateShipmentData } from './types';

export const shipmentService = {
  // Public - no auth required
  trackShipment: async (trackingNumber: string): Promise<ApiResponse<Shipment>> => {
    return await get<ApiResponse<Shipment>>(
      API_ENDPOINTS.TRACKING.TRACK(trackingNumber),
      false
    );
  },

  scanQRCode: async (trackingNumber: string): Promise<ApiResponse<Record<string, unknown>>> => {
    return await get<ApiResponse<Record<string, unknown>>>(
      API_ENDPOINTS.TRACKING.SCAN(trackingNumber),
      false
    );
  },

  // Customer only - requires auth
  createShipment: async (data: CreateShipmentData): Promise<ApiResponse<{ trackingNumber: string }>> => {
    return await post<ApiResponse<{ trackingNumber: string }>>(
      API_ENDPOINTS.TRACKING.CREATE_SHIPMENT,
      data,
      true
    );
  },

  getMyShipments: async (): Promise<ApiResponse<Shipment[]>> => {
    return await get<ApiResponse<Shipment[]>>(API_ENDPOINTS.TRACKING.MY_SHIPMENTS, true);
  },
};