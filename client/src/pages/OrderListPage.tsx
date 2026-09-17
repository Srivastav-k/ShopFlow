import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getOrders } from '../services/orderService';
import { formatPrice, formatDate } from '../utils/format';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-50 text-blue-700',
  PROCESSING: 'bg-yellow-50 text-yellow-700',
  SHIPPED: 'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

export function OrderListPage() {
  const { data, loading, error, refetch } = useApi(() => getOrders(), []);

  if (loading) return <LoadingSpinner message="Loading orders..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const orders = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Orders</h1>

      {orders.length === 0 ? (
        <EmptyState message="You haven't placed any orders yet." icon="📦" />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-900">Order #{order.id}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-bold text-slate-900">{formatPrice(order.subtotal)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
