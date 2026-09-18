import { orderRepository } from '../repositories/orderRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { NotFoundError, ValidationError } from '../utils/AppError.js';
import type { CreateOrderDTO, OrderItem } from '../types/index.js';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const DEMO_USER_ID = 1;

export const orderService = {
  async getAll() {
    await delay(100);
    return orderRepository.findAll(DEMO_USER_ID);
  },

  async getById(id: number) {
    await delay(100);
    const order = orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order', id);
    return order;
  },

  async create(data: CreateOrderDTO) {
    await delay(100);
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    const validatedItems: Omit<OrderItem, 'id' | 'orderId'>[] = [];
    let subtotal = 0;

    for (const item of data.items) {
      if (!item.productId) throw new ValidationError('Each item must have a productId');
      if (!item.quantity || item.quantity < 1) throw new ValidationError('Each item must have a quantity >= 1');

      const product = productRepository.findById(item.productId);
      if (!product) throw new NotFoundError('Product', item.productId);
      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order then deduct stock
    const order = orderRepository.create(DEMO_USER_ID, validatedItems, subtotal);

    for (const item of validatedItems) {
      const product = productRepository.findById(item.productId)!;
      productRepository.updateStock(item.productId, product.stock - item.quantity);
    }

    return order;
  },
};
