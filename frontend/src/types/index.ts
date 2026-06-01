export interface User {
  id: number;
  email: string;
  fullName: string;
  company: string;
  phone: string;
  role: 'FOURNISSEUR' | 'ACHETEUR' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
  user?: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  wholesalePrice: number;
  retailPrice: number;
  stockQuantity: number;
  minOrderQuantity: number;
  category: string;
  supplierId: number;
  supplierName: string;
  status?: string;
}

export interface Offer {
  id: number;
  productId: number;
  productName: string;
  buyerId: number;
  buyerName?: string;
  supplierId: number;
  proposedPrice: number;
  originalPrice?: number;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFERED' | 'PAID';
  message?: string;
  createdAt?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference: string;
  createdAt: string | number[];
  payerId: number;
  receiverId: number;
}

export interface MonthlyStats {
  month: string;
  offers: number;
  revenue: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOffers: number;
  acceptedOffers: number;
  conversionRate: number;
  totalRevenue: number;
  topCategory: string;
  monthlyStats?: MonthlyStats[];
}