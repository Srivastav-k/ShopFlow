import { categoryRepository } from '../repositories/categoryRepository.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/AppError.js';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../types/index.js';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(100);
    return categoryRepository.findAll();
  },

  async getById(id: number) {
    await delay(100);
    const category = categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category', id);
    return category;
  },

  async create(data: CreateCategoryDTO) {
    await delay(100);
    if (!data.name?.trim()) throw new ValidationError('Category name is required');
    const existing = categoryRepository.findByName(data.name.trim());
    if (existing) throw new ConflictError(`Category "${data.name}" already exists`);
    return categoryRepository.create({ name: data.name.trim(), description: data.description || '' });
  },

  async update(id: number, data: UpdateCategoryDTO) {
    await delay(100);
    const existing = categoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category', id);
    if (data.name !== undefined) {
      if (!data.name.trim()) throw new ValidationError('Category name cannot be empty');
      const duplicate = categoryRepository.findByName(data.name.trim());
      if (duplicate && duplicate.id !== id) throw new ConflictError(`Category "${data.name}" already exists`);
    }
    return categoryRepository.update(id, data)!;
  },

  async delete(id: number) {
    await delay(100);
    const existing = categoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category', id);
    if (categoryRepository.hasProducts(id)) {
      throw new ConflictError(`Cannot delete category "${existing.name}" because it has associated products`);
    }
    categoryRepository.delete(id);
    return { deleted: true };
  },
};
