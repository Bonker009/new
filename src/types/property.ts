export interface RenthouseDto {
  id: number;
  name: string;
  address?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  baseRent?: number;
  waterFee?: number;
  electricityFee?: number;
  imageUrl?: string;
  qrCodeImage?: string;
  createdAt: string;
  updatedAt: string;
  floors: FloorDto[];
  amenities?: string[];
}

export interface FloorDto {
  id: number;
  floorNumber: number;
  description?: string;
  rooms: RoomDto[];
}

export interface RoomDto {
  id: number;
  roomNumber: string;
  description?: string;
  monthlyRent?: number;
  deposit?: number;
  status?: string;
  bookedAt?: string;
  createdAt: string;
  updatedAt: string;
  floorId?: number;
  floorNumber?: number;
  renthouseId?: number;
  renthouseName?: string;
  renthouseAddress?: string;
  renterId?: number;
  renterName?: string;
  renterUsername?: string;
  renterFullName?: string;
  renterEmail?: string;
  renterPhone?: string;
  moveInDate?: string;
  isFavorite?: boolean;
  isOccupied: boolean;
}

export interface PaymentDto {
  id: number;
  roomId: number;
  type?: string;
  paymentMonth: string;
  roomFee?: number;
  electricityFee?: number;
  waterFee?: number;
  otherCharges?: number;
  otherChargesDescription?: string;
  totalAmount: number;
  status?: string;
  qrCodeData?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  room?: RoomDto;
  userName?: string;
}

export interface IncomeReportDto {
  period: string;
  totalIncome: number;
  totalRoomFees: number;
  totalElectricityFees: number;
  totalWaterFees: number;
  totalOtherCharges: number;
  paidPayments: number;
  unpaidPayments: number;
  occupancyRate: number;
}

export interface CreateRenthouseRequest {
  name: string;
  address?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  baseRent?: number;
  waterFee: string;
  electricityFee: string;
  imageUrl?: string;
  qrCodeImage?: string;
}

export interface CreateFloorRequest {
  floorNumber?: number;
  description?: string;
}

export interface CreateRoomRequest {
  roomNumber?: string;
  description?: string;
  monthlyRent?: number;
  deposit?: number;
}

export interface CreatePaymentRequest {
  roomId: number;
  paymentMonth: string;
  roomFee?: number;
  electricityFee?: number;
  waterFee?: number;
  otherCharges?: number;
  otherChargesDescription?: string;
  qrCodeData?: string;
}