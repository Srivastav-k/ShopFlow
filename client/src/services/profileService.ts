import { apiFetch } from './api';
import type { User, ApiResponse } from '../types';

export async function getProfile(): Promise<ApiResponse<User>> {
  return apiFetch<ApiResponse<User>>('/profile');
}

export async function updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  return apiFetch<ApiResponse<User>>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
