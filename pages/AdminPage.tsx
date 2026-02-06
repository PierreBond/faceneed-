import React, { useState } from 'react';
import { PageView, Product, Order, OrderStatus } from '../types';

interface AdminPageProps {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onNavigate: (page: PageView) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders';

const AdminPage: React.FC<AdminPageProps> = ({ 
  products, 
  orders, 
  onUpdateProduct, 
  onAddProduct, 
  onDeleteProduct, 
  onUpdateOrderStatus, 
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  
  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setActiveTab('products');
  };

  const handleAddNewClick = () => {
    setEditingProduct({
        id: `new_${Date.now()}`,
        name: '',
        category: 'Serums',
        price: 0,
        description: '',
        image: '',
        inStock: true,
        isBestSeller: false,
        reviews: 0,
        rating: 5
    });
    setActiveTab('products');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.name) {
        const existing = products.find(p => p.id === editingProduct.id);
        if (existing) {
            onUpdateProduct(editingProduct as Product);
        } else {
            // New Product
            onAddProduct(editingProduct as Product);
        }
        setEditingProduct(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        onDeleteProduct(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target;
    
    let newValue: any = value;
    if (type === 'number') {
        newValue = parseFloat(value);
    } else if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
    }

    setEditingProduct(prev => prev ? ({ ...prev, [name]: newValue }) : null);
  };

  const toggleStock = (product: Product) => {
      onUpdateProduct({ ...product, inStock: !product.inStock });
  };

  const renderContent = () => {
    if (editingProduct) {
        const isNew = !products.find(p => p.id === editingProduct.id);

        return (
            <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined">arrow_back</span> Back
                    </button>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{isNew ? 'Add New Product' : 'Edit Product'}</h2>
                </div>
                
                <form onSubmit={handleSaveProduct} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                            <input 
                                name="name" 
                                value={editingProduct.name} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price ($)</label>
                                <input 
                                    name="price" 
                                    type="number"
                                    step="0.01"
                                    value={editingProduct.price} 
                                    onChange={handleChange} 
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Original Price ($)</label>
                                <input 
                                    name="originalPrice" 
                                    type="number"
                                    step="0.01"
                                    value={editingProduct.originalPrice || ''} 
                                    onChange={handleChange} 
                                    placeholder="Optional"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                            <select 
                                name="category" 
                                value={editingProduct.category} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary"
                            >
                                <option value="Cleansers">Cleansers</option>
                                <option value="Serums">Serums</option>
                                <option value="Moisturizers">Moisturizers</option>
                                <option value="Treatments">Treatments</option>
                                <option value="Eye Care">Eye Care</option>
                                <option value="Sun Protection">Sun Protection</option>
                                <option value="Lips">Lips</option>
                                <option value="Face">Face</option>
                                <option value="Cheek">Cheek</option>
                                <option value="Eyes">Eyes</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URL</label>
                            <input 
                                name="image" 
                                value={editingProduct.image} 
                                onChange={handleChange} 
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                            <textarea 
                                name="description" 
                                value={editingProduct.description} 
                                onChange={handleChange} 
                                rows={4}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                             <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="inStock"
                                    checked={editingProduct.inStock !== false}
                                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, inStock: e.target.checked }) : null)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">In Stock</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="isBestSeller"
                                    checked={editingProduct.isBestSeller || false}
                                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, isBestSeller: e.target.checked }) : null)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Best Seller</span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                                {isNew ? 'Create Product' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400"><span className="material-symbols-outlined">payments</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400"><span className="material-symbols-outlined">shopping_cart</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                        <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400"><span className="material-symbols-outlined">inventory_2</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                        <p className="text-sm text-gray-500">Total Products</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold">View All</button>
                </div>
                <div className="space-y-4">
                     {orders.slice(0, 3).map((order, i) => (
                        <div key={order.id} className="flex items-center gap-4 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">New order #{order.id} from {order.customerName} (${order.total})</p>
                            <span className="text-xs text-gray-400">{order.date}</span>
                        </div>
                     ))}
                </div>
            </div>
          </div>
        );
      case 'products':
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Product Management</h2>
                    <button onClick={handleAddNewClick} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span> Add New
                    </button>
                </div>
                
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStock(product)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors ${
                                                    product.inStock !== false 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200' 
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
                                                }`}
                                            >
                                                {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-primary font-bold hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(product.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                    title="Delete Product"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
      case 'orders':
        return (
            <div className="space-y-6 animate-fadeIn">
                 <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Order Management</h2>
                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-primary">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.date}</td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{order.customerName}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : order.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                className="bg-gray-100 dark:bg-gray-800 border-none rounded text-xs py-1 px-2 focus:ring-1 focus:ring-primary"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 min-h-[60vh]">
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Admin Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin Panel</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as Super Admin</p>
                </div>
                <nav className="space-y-1">
                    <button 
                        onClick={() => { setActiveTab('dashboard'); setEditingProduct(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'dashboard' && !editingProduct ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                        Dashboard
                    </button>
                    <button 
                        onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${(activeTab === 'products' || editingProduct) ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">inventory_2</span>
                        Products
                    </button>
                    <button 
                        onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">shopping_bag</span>
                        Orders
                    </button>
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                        <button 
                            onClick={() => onNavigate('profile')}
                            className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                            Back to Profile
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {renderContent()}
            </main>
        </div>
    </div>
  );
};

export default AdminPage;