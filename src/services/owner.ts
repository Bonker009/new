import api from '@/lib/api';
import { ApiResponse } from '@/types/auth';
import { RenthouseDto, FloorDto, RoomDto, PaymentDto, IncomeReportDto } from '@/types/property';
import { CreateRenthouseRequest, CreateFloorRequest, CreateRoomRequest, CreatePaymentRequest } from '@/types/property';

export const ownerService = {
  // Renthouse Management
  getRenthouses: async (): Promise<ApiResponse<RenthouseDto[]>> => {
    const response = await api.get('/owner/renthouses');
    return response.data;
  },

  getRenthouseById: async (id: number): Promise<ApiResponse<RenthouseDto>> => {
    const response = await api.get(`/owner/renthouses/${id}`);
    return response.data;
  },

  createRenthouse: async (data: CreateRenthouseRequest): Promise<ApiResponse<RenthouseDto>> => {
    const response = await api.post('/owner/renthouses', data);
    return response.data;
  },

  updateRenthouse: async (id: number, data: CreateRenthouseRequest): Promise<ApiResponse<RenthouseDto>> => {
    const response = await api.put(`/owner/renthouses/${id}`, data);
    return response.data;
  },

  deleteRenthouse: async (id: number): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/owner/renthouses/${id}`);
    return response.data;
  },

  // Floor Management
  createFloor: async (renthouseId: number, data: CreateFloorRequest): Promise<ApiResponse<FloorDto>> => {
    const response = await api.post(`/owner/renthouses/${renthouseId}/floors`, data);
    return response.data;
  },

  // Room Management
  createRoom: async (floorId: number, data: CreateRoomRequest): Promise<ApiResponse<RoomDto>> => {
    const response = await api.post(`/owner/floors/${floorId}/rooms`, data);
    return response.data;
  },

  updateRoom: async (roomId: number, data: CreateRoomRequest): Promise<ApiResponse<RoomDto>> => {
    const response = await api.put(`/owner/rooms/${roomId}`, data);
    return response.data;
  },

  getAllRooms: async (): Promise<ApiResponse<RoomDto[]>> => {
    const response = await api.get('/owner/rooms');
    return response.data;
  },

  getRoomById: async (roomId: number): Promise<ApiResponse<RoomDto>> => {
    const response = await api.get(`/owner/rooms/${roomId}`);
    return response.data;
  },

  searchRooms: async (params: {
    roomNumber?: string;
    username?: string;
  }): Promise<ApiResponse<RoomDto[]>> => {
    const response = await api.get('/owner/rooms/search', { params });
    return response.data;
  },

  // Payment Management
  createPayment: async (data: CreatePaymentRequest): Promise<ApiResponse<PaymentDto>> => {
    const response = await api.post('/owner/payments', data);
    return response.data;
  },

  getPayments: async (): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get('/owner/payments');
    return response.data;
  },

  getRoomPayments: async (roomId: number): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get(`/owner/rooms/${roomId}/payments`);
    return response.data;
  },

  updatePaymentStatus: async (paymentId: number): Promise<ApiResponse<PaymentDto>> => {
    const response = await api.put(`/owner/payments/${paymentId}/status`);
    return response.data;
  },

  // Income Reports
  getMonthlyIncome: async (year: number, month: number): Promise<ApiResponse<IncomeReportDto>> => {
    const response = await api.get('/owner/income/monthly', {
      params: { year, month }
    });
    return response.data;
  },

  getYearlyIncome: async (year: number): Promise<ApiResponse<IncomeReportDto>> => {
    const response = await api.get('/owner/income/yearly', {
      params: { year }
    });
    return response.data;
  },

  // Tenant Management
  getAllTenants: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/owner/tenants');
    return response.data;
  },

  // Dashboard Statistics
  getActiveRoomsCount: async (): Promise<ApiResponse<number>> => {
    const response = await api.get('/owner/stats/active-rooms');
    return response.data;
  },

  getPendingPaymentsCount: async (): Promise<ApiResponse<number>> => {
    const response = await api.get('/owner/stats/pending-payments');
    return response.data;
  },

  // Dashboard Analytics
  getDashboardAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/owner/analytics');
    return response.data;
  },
};