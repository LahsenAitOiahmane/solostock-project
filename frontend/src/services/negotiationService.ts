import api from './api';
import { Offer } from '../types';

export interface CreateOfferPayload {
  productId: number;
  productName: string;
  buyerId: number;
  supplierId: number;
  proposedPrice: number;
  originalPrice: number;
  quantity: number;
  message?: string;
}

const negotiationService = {
  getOffersByBuyer: (buyerId: number) =>
    api.get<Offer[]>(`/api/negotiation/offers/buyer/${buyerId}`).then(res => res.data),

  getOffersBySupplier: (supplierId: number) =>
    api.get<Offer[]>(`/api/negotiation/offers/supplier/${supplierId}`).then(res => res.data),

  getAllOffers: () =>
    api.get<Offer[]>('/api/negotiation/offers').then(res => res.data),

  createOffer: (data: CreateOfferPayload) =>
    api.post<Offer>('/api/negotiation/offers', data).then(res => res.data),

  acceptOffer: (id: number) =>
    api.put(`/api/negotiation/offers/${id}/accept`),

  rejectOffer: (id: number) =>
    api.put(`/api/negotiation/offers/${id}/reject`),

  counterOffer: (id: number, newPrice: number) =>
    api.put(`/api/negotiation/offers/${id}/counter`, null, {
      params: { newPrice },
    }),
};

export default negotiationService;
