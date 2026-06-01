import api from './api';
import { Product } from '../types';

export interface CreateProductPayload {
  name: string;
  description: string;
  wholesalePrice: number;
  retailPrice: number;
  stockQuantity: number;
  minOrderQuantity: number;
  category: string;
  supplierId: number;
  supplierName: string;
}

const catalogService = {
  getProducts: () =>
    api.get<Product[]>('/api/catalog/products').then(res => res.data),

  getProductsBySupplier: (supplierId: number) =>
    api.get<Product[]>(`/api/catalog/products/supplier/${supplierId}`).then(res => res.data),

  createProduct: (data: CreateProductPayload) =>
    api.post<Product>('/api/catalog/products', data).then(res => res.data),

  updateProduct: (id: number, data: CreateProductPayload) =>
    api.put<Product>(`/api/catalog/products/${id}`, data).then(res => res.data),

  deleteProduct: (id: number) =>
    api.delete(`/api/catalog/products/${id}`),
};

export default catalogService;
