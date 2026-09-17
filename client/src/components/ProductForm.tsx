import { useState, useEffect, type FormEvent } from 'react';
import type { Product, Category } from '../types';
import { useApi } from '../hooks/useApi';
import { getCategories } from '../services/categoryService';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
}

export function ProductForm({ initialData, onSubmit, submitLabel, loading = false }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '');
  const [errors, setErrors] = useState<string[]>([]);

  const { data: categoriesData } = useApi(() => getCategories(), []);
  const categoryList: Category[] = categoriesData?.data || [];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPrice(initialData.price.toString());
      setDescription(initialData.description);
      setImageUrl(initialData.imageUrl);
      setStock(initialData.stock.toString());
    }
  }, [initialData]);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Name is required');
    if (!category.trim()) errs.push('Category is required');
    if (!price || parseFloat(price) < 0) errs.push('Price must be >= 0');
    if (!description.trim()) errs.push('Description is required');
    if (!stock || parseInt(stock) < 0) errs.push('Stock must be >= 0');
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    await onSubmit({
      name: name.trim(),
      category: category.trim(),
      price: parseInt(price),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      stock: parseInt(stock),
    });
  };

  const fieldClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="product-name" className={labelClass}>Name *</label>
        <input id="product-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="product-category" className={labelClass}>Category *</label>
        <select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
          <option value="">Select a category</option>
          {categoryList.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-price" className={labelClass}>Price (₹) *</label>
          <input id="product-price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="product-stock" className={labelClass}>Stock *</label>
          <input id="product-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className={labelClass}>Description *</label>
        <textarea id="product-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="product-imageUrl" className={labelClass}>Image URL</label>
        <input id="product-imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={fieldClass} placeholder="https://..." />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
