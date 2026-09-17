import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { EmptyState } from '../components/EmptyState';
import { useState } from 'react';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getItemCount } = useCart();
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleQuantityChange = (productId: number, newQty: number) => {
    const err = updateQuantity(productId, newQty);
    if (err) {
      setErrors((prev) => ({ ...prev, [productId]: err }));
      setTimeout(() => setErrors((prev) => { const next = { ...prev }; delete next[productId]; return next; }), 2000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Cart</h1>
        <EmptyState message="Your cart is empty." icon="🛒" />
        <div className="text-center mt-4">
          <Link to="/products" className="text-indigo-500 hover:text-indigo-600 text-sm font-medium">
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cart ({getItemCount()} items)</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 cursor-pointer">
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4">
              <img
                src={item.product.imageUrl || 'https://picsum.photos/seed/placeholder/100/100'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-slate-500">{item.product.category}</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{formatPrice(item.product.price)}</p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer">−</button>
                    <span className="px-2 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer">+</button>
                  </div>
                  <span className="text-sm text-slate-500">= {formatPrice(item.product.price * item.quantity)}</span>
                  <button onClick={() => removeItem(item.product.id)} className="ml-auto text-sm text-red-500 hover:text-red-600 cursor-pointer">
                    Remove
                  </button>
                </div>
                {errors[item.product.id] && (
                  <p className="text-xs text-red-500 mt-1 animate-fade-in">{errors[item.product.id]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-slate-600">
              <span>Items ({getItemCount()})</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200">
            <span>Total</span>
            <span>{formatPrice(getSubtotal())}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center mt-4 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
