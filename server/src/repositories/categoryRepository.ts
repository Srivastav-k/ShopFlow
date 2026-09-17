import { categories, products, getNextCategoryId } from '../db/database.js';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/index.js';

export const categoryRepository = {
  findAll(): Category[] {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  },

  findById(id: number): Category | undefined {
    return categories.find((c) => c.id === id);
  },

  findByName(name: string): Category | undefined {
    return categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  },

  create(data: CreateCategoryDTO): Category {
    const category: Category = {
      id: getNextCategoryId(),
      name: data.name,
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };
    categories.push(category);
    return category;
  },

  update(id: number, data: UpdateCategoryDTO): Category | undefined {
    const category = categories.find((c) => c.id === id);
    if (!category) return undefined;

    if (data.name !== undefined) category.name = data.name;
    if (data.description !== undefined) category.description = data.description;

    return category;
  },

  delete(id: number): boolean {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    categories.splice(index, 1);
    return true;
  },

  hasProducts(id: number): boolean {
    const category = categories.find((c) => c.id === id);
    if (!category) return false;
    return products.some((p) => p.category === category.name);
  },
};
