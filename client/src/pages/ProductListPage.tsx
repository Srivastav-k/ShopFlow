import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getProducts, type ProductQueryParams } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { SortSelect } from '../components/SortSelect';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

export function ProductListPage() {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const limit = 9;

  const params: ProductQueryParams = { search: activeSearch, category, sort, page, limit };

  const { data, loading, error, refetch } = useApi(
    () => getProducts(params),
    [activeSearch, category, sort, page]
  );

  const { data: categoriesData } = useApi(() => getCategories(), []);
  const categoryNames = (categoriesData?.data || []).map((c) => c.name);

  const handleSearch = useCallback(() => {
    setActiveSearch(search);
    setPage(1);
  }, [search]);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((s: string) => {
    setSort(s);
    setPage(1);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <CategoryFilter categories={categoryNames} selected={category} onChange={handleCategoryChange} />
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !data?.data?.length ? (
        <EmptyState message={activeSearch || category ? 'No products match your search.' : 'No products found.'} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data.pagination && (
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
