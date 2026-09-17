import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useApi } from '../hooks/useApi';
import { getProfile } from '../services/profileService';
import { createOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getItemCount, clearCart } = useCart();
  const { data: profileData, loading: profileLoading } = useApi(() => getProfile(), []);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = profileData?.data;

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      setError(null);
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      const result = await createOrder(orderItems);
      clearCart();
      navigate(`/orders/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>
        <EmptyState message="Your cart is empty. Add some products first." icon="🛒" />
        <div className="text-center mt-4">
          <Link to="/products" className="text-indigo-500 hover:text-indigo-600 text-sm font-medium">Browse Products →</Link>
        </div>
      </div>
    );
  }

  if (profileLoading) return <LoadingSpinner message="Loading checkout..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 animate-fade-in">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Items */}
        <div>
          <h2 className="font-semibold text-slate-900 mb-3">Cart Items ({getItemCount()})</h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.product.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{item.product.name}</p>
                  <p className="text-xs text-slate-500">{formatPrice(item.product.price)} × {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900 text-sm">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Shipping info */}
          {profile && (
            <div className="mt-6">
              <h2 className="font-semibold text-slate-900 mb-3">Shipping Information</h2>
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">{profile.name}</p>
                <p>{profile.address.street}</p>
                <p>{profile.address.city}, {profile.address.state} {profile.address.postalCode}</p>
                <p>{profile.address.country}</p>
                <p>{profile.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({getItemCount()} items)</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200 mb-6">
            <span>Total</span>
            <span>{formatPrice(getSubtotal())}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            Prices are calculated server-side. Your cart total may differ if prices have changed.
          </p>
        </div>
      </div>
    </div>
  );
}
