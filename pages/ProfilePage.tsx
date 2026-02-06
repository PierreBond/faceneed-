import React, { useState } from 'react';
import { PageView, UserInfo, Order } from '../types';

interface ProfilePageProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onNavigate: (page: PageView) => void;
  orders: Order[];
}

type Tab = 'dashboard' | 'orders' | 'addresses' | 'details';

const ProfilePage: React.FC<ProfilePageProps> = ({ userInfo, setUserInfo, onNavigate, orders }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(userInfo.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      return;
    }
    // Logic to save details would go here
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Hello, {userInfo.firstName || 'User'}!</h2>
            <p className="text-gray-600 dark:text-gray-400">
                From your account dashboard you can view your <button onClick={() => setActiveTab('orders')} className="text-primary hover:underline">recent orders</button>, 
                manage your <button onClick={() => setActiveTab('addresses')} className="text-primary hover:underline">shipping addresses</button>, 
                and edit your <button onClick={() => setActiveTab('details')} className="text-primary hover:underline">password and account details</button>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary"><span className="material-symbols-outlined">shopping_bag</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                        <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary"><span className="material-symbols-outlined">payments</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary"><span className="material-symbols-outlined">location_on</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                        <p className="text-sm text-gray-500">Saved Address</p>
                    </div>
                </div>
            </div>
          </div>
        );
      case 'orders':
        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Order History</h2>
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 transition-all hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Order <span className="text-primary">{order.id}</span></p>
                                        <p className="text-sm text-gray-500">{order.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                            : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : order.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {order.status}
                                        </span>
                                        <p className="font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {order.items.map((img, i) => (
                                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 overflow-hidden">
                                                <img src={img} alt="Product" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="ml-auto text-sm font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No orders yet.</p>
                )}
            </div>
        );
      case 'addresses':
        return (
            <div className="space-y-6 animate-fadeIn">
                 <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                 <div className="grid grid-cols-1 gap-6">
                    <form className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                                <input name="address" value={userInfo.address} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                <input name="city" value={userInfo.city} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                <input name="state" value={userInfo.state} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip Code</label>
                                <input name="zip" value={userInfo.zip} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                             </div>
                        </div>
                        <div className="pt-4">
                            <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">Save Address</button>
                        </div>
                    </form>
                 </div>
            </div>
        );
      case 'details':
        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Account Details</h2>
                <form onSubmit={handleSaveDetails} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                            <input name="firstName" value={userInfo.firstName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                            <input name="lastName" value={userInfo.lastName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                            <input 
                                name="email" 
                                value={userInfo.email} 
                                onChange={handleChange} 
                                className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} 
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                            <input name="phone" value={userInfo.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                    </div>
                    <div className="pt-4">
                         <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">Save Changes</button>
                    </div>
                </form>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 min-h-[60vh]">
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <nav className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">package</span>
                        Orders
                    </button>
                    <button 
                        onClick={() => setActiveTab('addresses')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'addresses' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">location_on</span>
                        Addresses
                    </button>
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'details' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-xl">person</span>
                        Account Details
                    </button>
                    
                    {/* Admin Access Button */}
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                        <button 
                            onClick={() => onNavigate('admin')}
                            className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                            Admin Panel
                        </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                        <button 
                            onClick={() => onNavigate('home')}
                            className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                            Logout
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

export default ProfilePage;