import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ProductForm, type ProductFormData } from '../components/ProductForm';
import { createProduct } from '../services/productService';

export function ProductNewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createProduct(data);
      navigate(`/products/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Product</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 animate-fade-in">
            {error}
          </div>
        )}
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" loading={loading} />
      </div>
    </div>
  );
}
