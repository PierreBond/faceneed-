import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { ProductForm } from '../components/ProductForm';
import { AdminGuard, useIsAdmin } from '../components/AdminGuard';
import { Product } from '../types';

interface AdminProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: 'draft' | 'published';
  thumbnail: string;
  images: string[];
  variants: Array<{
    id: string;
    prices: Array<{ amount: number; currency_code: string }>;
    inventory_quantity: number;
  }>;
  categories: Array<{ id: string; name: string }>;
  tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const AdminProductsPage: React.FC = () => {
  const isAdmin = useIsAdmin();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { limit: 50 };
      if (filters.status) params.status = filters.status;
      if (filters.search) params.q = filters.search;
      
      const { products: prods } = await ApiService.admin.products.list(params);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    setFormLoading(true);
    try {
      const { product } = await ApiService.admin.products.create(data);
      setProducts([product, ...products]);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Create failed:', err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setFormLoading(true);
    try {
      await ApiService.admin.products.update(editingProduct!.id, data);
      setProducts(products.map(p => p.id === editingProduct!.id ? { ...p, ...data } : p));
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Update failed:', err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await ApiService.admin.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  if (!isAdmin) {
    return null; // AdminGuard will handle redirect
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Product Management</h2>
        <button onClick={handleNew} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 outline-none transition-all"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 outline-none transition-all"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading products...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No products found. Click "Add Product" to create your first product.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map(product => {
                  const variant = product.variants?.[0];
                  const price = variant?.prices?.[0]?.amount || 0;
                  const stock = variant?.inventory_quantity || 0;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                            {product.thumbnail ? (
                              <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-xs">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {product.categories?.map(c => c.name).join(', ') || '—'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ₵{price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          product.status === 'published'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {stock > 0 ? stock : <span className="text-red-500">Out of stock</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-primary font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete Product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? `Edit: ${editingProduct.title}` : 'Add New Product'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingProduct(null); }}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                initialData={editingProduct ? {
                  title: editingProduct.title,
                  description: editingProduct.description,
                  price: editingProduct.variants?.[0]?.prices?.[0]?.amount / 100 || 0,
                  compare_at_price: editingProduct.variants?.[0]?.prices?.[1]?.amount / 100 || null,
                  category_id: editingProduct.categories?.[0]?.id || '',
                  images: editingProduct.images || [],
                  status: editingProduct.status,
                  tags: editingProduct.tags || [],
                  seo_title: editingProduct.metadata?.seo_title,
                  seo_description: editingProduct.metadata?.seo_description,
                } : null}
                onSubmit={editingProduct ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                isLoading={formLoading}
                isEditing={!!editingProduct}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper with AdminGuard
export const AdminProductsPageWithGuard: React.FC = () => (
  <AdminGuard>
    <AdminProductsPage />
  </AdminGuard>
);

export default AdminProductsPageWithGuard;