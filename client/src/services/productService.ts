import { apiFetch } from './api';
import type { Product, ApiResponse, PaginatedResponse } from '../types';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return apiFetch<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ''}`);
}

export async function getProduct(id: number): Promise<ApiResponse<Product>> {
  return apiFetch<ApiResponse<Product>>(`/products/${id}`);
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
  return apiFetch<ApiResponse<Product>>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<ApiResponse<Product>> {
  return apiFetch<ApiResponse<Product>>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch(`/products/${id}`, { method: 'DELETE' });
}
