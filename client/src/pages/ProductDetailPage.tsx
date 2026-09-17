import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useCart } from '../hooks/useCart';
import { getProduct, deleteProduct } from '../services/productService';
import { formatPrice } from '../utils/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [toast, setToast] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data, loading, error, refetch } = useApi(
    () => getProduct(parseInt(id!)),
    [id]
  );

  const product = data?.data;

  const handleAddToCart = () => {
    if (!product) return;
    const err = addItem(product, quantity);
    if (err) {
      setToast(err);
    } else {
      setToast('Added to cart!');
      setQuantity(1);
    }
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProduct(parseInt(id!));
      navigate('/products');
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to delete product');
      setDeleting(false);
      setShowDelete(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const outOfStock = product.stock <= 0;

  return (
    <div className="animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative">
            <img
              src={product.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
            {outOfStock && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-sm font-medium text-indigo-500 mb-1">{product.category}</span>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h1>
            <p className="text-slate-600 text-sm mb-6 flex-1">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                <p className={`text-sm font-medium ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
                  {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
                </p>
              </div>

              {!outOfStock && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-slate-600 hover:bg-slate-50 cursor-pointer">−</button>
                    <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 text-slate-600 hover:bg-slate-50 cursor-pointer">+</button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {toast && (
                <div className={`text-sm text-center py-2 rounded-lg animate-fade-in ${
                  toast.includes('Added') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {toast}
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="flex-1 py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Edit Product
                </Link>
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${product.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
