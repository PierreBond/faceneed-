import React, { useState } from 'react';
import { PageView, UserInfo } from '../types';

interface ProfilePageProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onNavigate: (page: PageView) => void;
}

type Tab = 'dashboard' | 'orders' | 'addresses' | 'details';

const mockOrders = [
  { 
    id: 'FN-82934102', 
    date: 'Oct 24, 2024', 
    status: 'Processing', 
    total: 124.50, 
    items: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBLl0G7eJsEBfZgXQ9-byifxkqUfBxojVvYtHoSAFypbLRZMpkW0IKD6PM2TDva4bnm2vvwgGNDifLgghmk76nU7dlXsZw3AvMPWNvX6H8gNM0IX69p5n14Lme4uDPuSePZ3wit1B5tivwafxsYCHy2Br5sMhW1QQjTAjqdnPj-AnDfZSrgetZfXfLJzun2EgXMvKulqDjWZYx_fpVNCP8D6_V1n78ZsGAjtEjiKgxgl8YtGg-4QksmMyNvS1r846HWckCksiHg4Pw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAchRdyKkv02pUAScnNtjiay_ORc4zYUeOjK7hqYUydk0pUh98w9BfuL6XDITJD7f8TxK985Y81A9veKpb1uJlxIZ_LEJBO5wmbTkcZ94bxa0senYR6JvomxTgGlqijy_bM2EmrwehRT3Re2SfV0s4EtKHo7sJg81UWtW45GiJLFSVoEnapuXxWHeIA7nd2SZefyVjJ1w95nzqU1s8HgOwh5Jk3NuXya0GiojkCsEjBq2ZlA9H6VLAlMHeMC6ig8DafDJZXgE7vhxk'
    ] 
  },
  { 
    id: 'FN-77283911', 
    date: 'Sep 12, 2024', 
    status: 'Delivered', 
    total: 42.00, 
    items: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VYiq1oS976pecnT8VgQtDhfXIGU_c7KzEoUgv6BWTWmIwYRBcM5W3i-X1sbu_XKMfRhRON5CovnLcO6uDEeYlEs74dlGtrGkwihlBlF7x2wMpsX3dqzWwFRmLFgwgs1UfyRz_FMQf_aXkP1-tZTYjZpMWU0O7pNKmqRXJPrN73qEtLq5X8lMu-u38IFaVXd3muZrd4pUQMZqlDRSCvhnSYgEI0zvyVICgqSvXBwBoSnG78by9PUbKf26h5MqcDM4ALF0hRwbLtk'
    ] 
  },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ userInfo, setUserInfo, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
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
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                        <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary"><span className="material-symbols-outlined">payments</span></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">$166.50</p>
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
                {mockOrders.length > 0 ? (
                    <div className="space-y-4">
                        {mockOrders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 transition-all hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Order <span className="text-primary">{order.id}</span></p>
                                        <p className="text-sm text-gray-500">{order.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
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
                <form className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
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
                            <input name="email" value={userInfo.email} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                            <input name="phone" value={userInfo.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                    </div>
                    <div className="pt-4">
                         <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">Save Changes</button>
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