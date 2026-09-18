import { productRepository } from "../repositories/productRepository.js";
import { NotFoundError, ValidationError } from "../utils/AppError.js";
import type {
  ProductQueryParams,
  CreateProductDTO,
  UpdateProductDTO,
} from "../types/index.js";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getAll(params: ProductQueryParams) {
    await delay(100);
    return productRepository.findAll(params);
  },

  async getById(id: number) {
    await delay(100);
    const product = productRepository.findById(id);
    if (!product) throw new NotFoundError("Product", id);
    return product;
  },

  async create(data: CreateProductDTO) {
    await delay(100);
    validate(data);
    return productRepository.create(data);
  },

  async update(id: number, data: UpdateProductDTO) {
    await delay(100);
    const existing = productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product", id);
    validatePartial(data);
    return productRepository.update(id, data)!;
  },

  async delete(id: number) {
    await delay(100);
    const existing = productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product", id);

    if (productRepository.hasOrderItems(id)) {
      productRepository.updateStock(id, 0);
      productRepository.update(id, { name: `[Discontinued] ${existing.name}` });
      return { discontinued: true };
    }

    productRepository.delete(id);
    return { deleted: true };
  },
};

function validate(data: CreateProductDTO) {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Name is required");
  if (!data.category?.trim()) errors.push("Category is required");
  if (data.price === undefined || data.price === null || data.price < 0)
    errors.push("Price is required and must be >= 0");
  if (!data.description?.trim()) errors.push("Description is required");
  if (data.stock === undefined || data.stock === null || data.stock < 0)
    errors.push("Stock is required and must be >= 0");
  if (errors.length > 0) throw new ValidationError(errors.join(". "));
}

function validatePartial(data: UpdateProductDTO) {
  const errors: string[] = [];
  if (data.name !== undefined && !data.name.trim())
    errors.push("Name cannot be empty");
  if (data.category !== undefined && !data.category.trim())
    errors.push("Category cannot be empty");
  if (data.price !== undefined && data.price < 0)
    errors.push("Price must be >= 0");
  if (data.stock !== undefined && data.stock < 0)
    errors.push("Stock must be >= 0");
  if (errors.length > 0) throw new ValidationError(errors.join(". "));
}
