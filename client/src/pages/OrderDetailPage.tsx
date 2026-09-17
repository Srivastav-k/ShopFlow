import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getOrder } from '../services/orderService';
import { getProfile } from '../services/profileService';
import { formatPrice, formatDateTime } from '../utils/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useApi(() => getOrder(parseInt(id!)), [id]);
  const { data: profileData } = useApi(() => getProfile(), []);

  if (loading) return <LoadingSpinner message="Loading order..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const order = data?.data;
  const profile = profileData?.data;

  if (!order) return <ErrorMessage message="Order not found" />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
        <span className={`inline-flex text-sm font-medium px-3 py-1 rounded-full border ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <p className="text-sm text-slate-500">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center">
                  <div>
                    <Link to={`/products/${item.productId}`} className="font-medium text-slate-900 hover:text-indigo-600 transition-colors text-sm">
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Shipping Information</h3>
            {profile ? (
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">{profile.name}</p>
                <p>{profile.address.street}</p>
                <p>{profile.address.city}, {profile.address.state} {profile.address.postalCode}</p>
                <p>{profile.address.country}</p>
                <p className="pt-2">{profile.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
