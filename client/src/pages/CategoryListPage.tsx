import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import type { Category } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function CategoryListPage() {
  const { data, loading, error, refetch } = useApi(() => getCategories(), []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const categories: Category[] = data?.data || [];

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await createCategory({ name: newName.trim(), description: newDesc.trim() });
      setNewName('');
      setNewDesc('');
      setShowAdd(false);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await updateCategory(id, { name: editName.trim(), description: editDesc.trim() });
      setEditingId(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete category');
      setDeleteTarget(null);
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  const fieldClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  if (loading) return <LoadingSpinner message="Loading categories..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
        >
          {showAdd ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 animate-fade-in">
          {actionError}
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 animate-fade-in">
          <div className="space-y-3">
            <input type="text" placeholder="Category name" value={newName} onChange={(e) => setNewName(e.target.value)} className={fieldClass} />
            <input type="text" placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className={fieldClass} />
            <button onClick={handleCreate} disabled={actionLoading} className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 cursor-pointer">
              {actionLoading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {categories.length === 0 ? (
        <EmptyState message="No categories found." icon="📂" />
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-4">
              {editingId === cat.id ? (
                <div className="space-y-3">
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={fieldClass} />
                  <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className={fieldClass} />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(cat.id)} disabled={actionLoading} className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 cursor-pointer">
                      {actionLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-slate-600 bg-slate-100 text-sm rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    {cat.description && <p className="text-sm text-slate-500 mt-0.5">{cat.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(cat)} className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
