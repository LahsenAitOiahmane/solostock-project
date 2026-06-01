import api from './api';

const authService = {
  getUsers: async () => {
    const response = await api.get('/api/auth/users');
    return response.data;
  },

  updateUserStatus: async (id: number, active: boolean) => {
    const response = await api.put(`/api/auth/users/${id}/status`, null, {
      params: { active }
    });
    return response.data;
  }
};

export default authService;
