import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getProduct, updateProduct } from '../services/productService';
import { ProductForm, type ProductFormData } from '../components/ProductForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, loading, error: fetchError, refetch } = useApi(
    () => getProduct(parseInt(id!)),
    [id]
  );

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setSaving(true);
      setError(null);
      await updateProduct(parseInt(id!), formData);
      navigate(`/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (fetchError) return <ErrorMessage message={fetchError} onRetry={refetch} />;
  if (!data?.data) return <ErrorMessage message="Product not found" />;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to={`/products/${id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Product
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Product</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 animate-fade-in">
            {error}
          </div>
        )}
        <ProductForm initialData={data.data} onSubmit={handleSubmit} submitLabel="Update Product" loading={saving} />
      </div>
    </div>
  );
}
