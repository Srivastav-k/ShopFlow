import { apiFetch } from './api';
import type { Order, ApiResponse } from '../types';

export async function getOrders(): Promise<ApiResponse<Order[]>> {
  return apiFetch<ApiResponse<Order[]>>('/orders');
}

export async function getOrder(id: number): Promise<ApiResponse<Order>> {
  return apiFetch<ApiResponse<Order>>(`/orders/${id}`);
}

export async function createOrder(items: { productId: number; quantity: number }[]): Promise<ApiResponse<Order>> {
  return apiFetch<ApiResponse<Order>>('/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}
