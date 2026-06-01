import api from './api';
import { DashboardStats } from '../types';

const analyticsService = {
  getDashboardStats: () =>
    api.get<DashboardStats>('/api/analytics/dashboard').then(res => res.data),
};

export default analyticsService;
