import api from './api';
import { Transaction } from '../types';

export interface PaymentPayload {
  payerId: number;
  receiverId: number;
  amount: number;
  method: string;
}

const paymentService = {
  getTransactionsByPayer: (payerId: number) =>
    api.get<Transaction[]>(`/api/payment/transactions/payer/${payerId}`).then(res => res.data),

  getAllTransactions: () =>
    api.get<Transaction[]>('/api/payment/transactions').then(res => res.data),

  submitPayment: (data: PaymentPayload) =>
    api.post('/api/payment/pay', data).then(res => res.data),
};

export default paymentService;
