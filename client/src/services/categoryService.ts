import { apiFetch } from './api';
import type { Category, ApiResponse } from '../types';

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiFetch<ApiResponse<Category[]>>('/categories');
}

export async function getCategory(id: number): Promise<ApiResponse<Category>> {
  return apiFetch<ApiResponse<Category>>(`/categories/${id}`);
}

export async function createCategory(data: { name: string; description?: string }): Promise<ApiResponse<Category>> {
  return apiFetch<ApiResponse<Category>>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: { name?: string; description?: string }): Promise<ApiResponse<Category>> {
  return apiFetch<ApiResponse<Category>>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await apiFetch(`/categories/${id}`, { method: 'DELETE' });
}
