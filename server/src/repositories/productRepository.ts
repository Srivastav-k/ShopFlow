import { products, orders, getNextProductId } from '../db/database.js';
import type { Product, ProductQueryParams, CreateProductDTO, UpdateProductDTO } from '../types/index.js';

export const productRepository = {
  findAll(params: ProductQueryParams) {
    let filtered = [...products];

    // Search
    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (params.category) {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    const totalItems = filtered.length;

    // Sort
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Pagination
    const page = parseInt(params.page || '1') || 1;
    const limit = parseInt(params.limit || '10') || 10;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalItems / limit);
    const paginated = filtered.slice(offset, offset + limit);

    return {
      products: paginated,
      pagination: { page, limit, totalItems, totalPages },
    };
  },

  findById(id: number): Product | undefined {
    return products.find((p) => p.id === id);
  },

  create(data: CreateProductDTO): Product {
    const now = new Date().toISOString();
    const product: Product = {
      id: getNextProductId(),
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl || '',
      stock: data.stock,
      createdAt: now,
      updatedAt: now,
    };
    products.push(product);
    return product;
  },

  update(id: number, data: UpdateProductDTO): Product | undefined {
    const product = products.find((p) => p.id === id);
    if (!product) return undefined;

    if (data.name !== undefined) product.name = data.name;
    if (data.category !== undefined) product.category = data.category;
    if (data.price !== undefined) product.price = data.price;
    if (data.description !== undefined) product.description = data.description;
    if (data.imageUrl !== undefined) product.imageUrl = data.imageUrl;
    if (data.stock !== undefined) product.stock = data.stock;
    product.updatedAt = new Date().toISOString();

    return product;
  },

  delete(id: number): boolean {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  hasOrderItems(id: number): boolean {
    return orders.some((o) => o.items.some((item) => item.productId === id));
  },

  updateStock(id: number, newStock: number): void {
    const product = products.find((p) => p.id === id);
    if (product) {
      product.stock = newStock;
      product.updatedAt = new Date().toISOString();
    }
  },
};
