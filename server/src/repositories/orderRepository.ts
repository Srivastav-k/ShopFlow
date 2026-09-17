import { orders, getNextOrderId, getNextOrderItemId } from '../db/database.js';
import type { Order, OrderItem } from '../types/index.js';

export const orderRepository = {
  findAll(userId: number): Order[] {
    return orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById(id: number): Order | undefined {
    return orders.find((o) => o.id === id);
  },

  create(
    userId: number,
    items: Omit<OrderItem, 'id' | 'orderId'>[],
    subtotal: number
  ): Order {
    const orderId = getNextOrderId();
    const orderItems: OrderItem[] = items.map((item) => ({
      id: getNextOrderItemId(),
      orderId,
      ...item,
    }));

    const order: Order = {
      id: orderId,
      userId,
      items: orderItems,
      subtotal,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    return order;
  },
};
