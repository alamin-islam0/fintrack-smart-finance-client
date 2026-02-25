import { api } from './client';

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
  photoUrl?: string;
}

interface ProfilePayload {
  name: string;
  photoUrl?: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  register: (payload: AuthPayload) => api.post('/auth/register', payload),
  login: (payload: AuthPayload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  updateProfile: (payload: ProfilePayload) => api.put('/auth/profile', payload),
  changePassword: (payload: ChangePasswordPayload) => api.put('/auth/change-password', payload)
};
