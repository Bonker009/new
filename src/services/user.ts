import api from '@/lib/api';
import { ApiResponse, RenthouseDto, RoomDto, PaymentDto } from '@/types/property';

export const userService = {
  // Get featured renthouses for dashboard
  getFeaturedRenthouses: async (): Promise<ApiResponse<RenthouseDto[]>> => {
    const response = await api.get('/user/renthouses/featured');
    return response.data;
  },

  // Get nearby renthouses
  getNearbyRenthouses: async (latitude: number, longitude: number, radiusKm: number = 10.0): Promise<ApiResponse<RenthouseDto[]>> => {
    const response = await api.get('/user/renthouses/nearby', {
      params: { latitude, longitude, radiusKm }
    });
    return response.data;
  },

  // Search renthouses
  searchRenthouses: async (params: {
    name?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ApiResponse<RenthouseDto[]>> => {
    const response = await api.get('/user/renthouses/search', { params });
    return response.data;
  },

  // Get renthouse details
  getRenthouseDetails: async (id: string): Promise<ApiResponse<RenthouseDto>> => {
    const response = await api.get(`/user/renthouses/${id}`);
    return response.data;
  },

  // Get room details
  getRoomDetails: async (id: string): Promise<ApiResponse<RoomDto>> => {
    const response = await api.get(`/user/rooms/${id}`);
    return response.data;
  },

  // Get payments for a room
  getPaymentsForRoom: async (id: string): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get(`/user/rooms/${id}/payments`);
    return response.data;
  },

  // Get available rooms in a renthouse
  getAvailableRooms: async (id: string): Promise<ApiResponse<RoomDto[]>> => {
    const response = await api.get(`/user/renthouses/${id}/rooms/available`);
    return response.data;
  },

  // Book a room
  bookRoom: async (roomId: number): Promise<ApiResponse<RoomDto>> => {
    const response = await api.post(`/user/rooms/${roomId}/book`);
    return response.data;
  },

  // Add room to favorites
  addToFavorites: async (roomId: number): Promise<ApiResponse<string>> => {
    const response = await api.post(`/user/favorites/${roomId}`);
    return response.data;
  },

  // Remove room from favorites
  removeFromFavorites: async (roomId: number): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/user/favorites/${roomId}`);
    return response.data;
  },

  // Add renthouse to favorites
  addRenthouseToFavorites: async (renthouseId: number): Promise<ApiResponse<string>> => {
    const response = await api.post(`/user/renthouses/${renthouseId}/favorites`);
    return response.data;
  },

  // Remove renthouse from favorites
  removeRenthouseFromFavorites: async (renthouseId: number): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/user/renthouses/${renthouseId}/favorites`);
    return response.data;
  },

  // Check if renthouse is in favorites
  checkRenthouseInFavorites: async (renthouseId: number): Promise<ApiResponse<boolean>> => {
    const response = await api.get(`/user/renthouses/${renthouseId}/favorites/check`);
    return response.data;
  },

  // Get current booking
  getCurrentBooking: async (): Promise<ApiResponse<RoomDto | null>> => {
    const response = await api.get('/user/booking/current');
    return response.data;
  },

  getAllMyBookings: async (): Promise<ApiResponse<RoomDto[]>> => {
    const response = await api.get('/user/bookings/all');
    return response.data;
  },

  // Get favorite rooms
  getFavorites: async (): Promise<ApiResponse<RoomDto[]>> => {
    const response = await api.get('/user/favorites');
    return response.data;
  },

  // Get user payments
  getPayments: async (): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get('/user/payments');
    return response.data;
  },

  // Get pending payments
  getPendingPayments: async (): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get('/user/payments/pending');
    return response.data;
  },

  // Get payments by status
  getPaymentsByStatus: async (status: string): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get(`/user/payments/status/${status}`);
    return response.data;
  },

  // Get payment QR code
  getPaymentQRCode: async (paymentId: number): Promise<ApiResponse<string>> => {
    const response = await api.get(`/user/payments/${paymentId}/qr-code`);
    return response.data;
  },
};