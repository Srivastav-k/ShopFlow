import { categoryRepository } from '../repositories/categoryRepository.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/AppError.js';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../types/index.js';

export const categoryService = {
  getAll() {
    return categoryRepository.findAll();
  },

  getById(id: number) {
    const category = categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category', id);
    return category;
  },

  create(data: CreateCategoryDTO) {
    if (!data.name?.trim()) throw new ValidationError('Category name is required');
    const existing = categoryRepository.findByName(data.name.trim());
    if (existing) throw new ConflictError(`Category "${data.name}" already exists`);
    return categoryRepository.create({ name: data.name.trim(), description: data.description || '' });
  },

  update(id: number, data: UpdateCategoryDTO) {
    const existing = categoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category', id);
    if (data.name !== undefined) {
      if (!data.name.trim()) throw new ValidationError('Category name cannot be empty');
      const duplicate = categoryRepository.findByName(data.name.trim());
      if (duplicate && duplicate.id !== id) throw new ConflictError(`Category "${data.name}" already exists`);
    }
    return categoryRepository.update(id, data)!;
  },

  delete(id: number) {
    const existing = categoryRepository.findById(id);
    if (!existing) throw new NotFoundError('Category', id);
    if (categoryRepository.hasProducts(id)) {
      throw new ConflictError(`Cannot delete category "${existing.name}" because it has associated products`);
    }
    categoryRepository.delete(id);
    return { deleted: true };
  },
};
