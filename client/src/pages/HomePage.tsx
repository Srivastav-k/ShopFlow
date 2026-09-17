import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <div className="text-center py-16 md:py-24">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-subtle"></span>
          Caching Learning Laboratory
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">ShopFlow</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          A realistic e-commerce application built for learning caching strategies — from HTTP cache to Redis.
          Every request currently hits the server. Start experimenting.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
          >
            Browse Products
          </Link>
          <Link
            to="/categories"
            className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            View Categories
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: '🛍️', title: 'Products', desc: '30 products across 6 categories with full CRUD', link: '/products' },
          { icon: '🛒', title: 'Cart & Checkout', desc: 'In-memory cart with stock validation and order creation', link: '/cart' },
          { icon: '📦', title: 'Orders', desc: 'Server-side price calculation, stock deduction, order history', link: '/orders' },
        ].map((feature) => (
          <Link
            key={feature.title}
            to={feature.link}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 block">{feature.icon}</span>
            <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
            <p className="text-sm text-slate-500">{feature.desc}</p>
          </Link>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-xl font-bold mb-2">No Caching Implemented</h2>
        <p className="text-indigo-100 text-sm max-w-lg mx-auto">
          Open Chrome DevTools Network tab. Every navigation and interaction produces a fresh API request to the server.
          You'll progressively add caching layers yourself.
        </p>
      </div>
    </div>
  );
}
