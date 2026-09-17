import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [toast, setToast] = useState<string | null>(null);

  const handleAddToCart = () => {
    const error = addItem(product);
    if (error) {
      setToast(error);
    } else {
      setToast('Added to cart!');
    }
    setTimeout(() => setToast(null), 2000);
  };

  const outOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
        <img
          src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/300'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-indigo-500 mb-1">{product.category}</span>
        <Link to={`/products/${product.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <p className="text-slate-500 text-xs mt-1 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            <p className={`text-xs ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
              {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="px-3 py-2 bg-indigo-500 text-white text-xs font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
          >
            Add to Cart
          </button>
        </div>

        {toast && (
          <div className={`mt-2 text-xs text-center py-1 rounded animate-fade-in ${
            toast.includes('Added') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
