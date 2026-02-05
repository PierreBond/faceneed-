import React, { useState } from 'react';
import { PageView, CartItem, UserInfo } from '../types';

interface CheckoutShippingPageProps {
  cart: CartItem[];
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onNavigate: (page: PageView) => void;
}

const CheckoutShippingPage: React.FC<CheckoutShippingPageProps> = ({ cart, userInfo, setUserInfo, onNavigate }) => {
  const [errors, setErrors] = useState<{ email?: string }>({});
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0825; // 8.25%
  const total = subtotal + tax;

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

  const handleContinue = () => {
    if (!userInfo.email || !validateEmail(userInfo.email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }
    onNavigate('checkout-payment');
  };

  return (
    <div className="flex-1 px-4 lg:px-40 py-8 lg:py-12 bg-background-light dark:bg-background-dark font-display text-[#0e141b] dark:text-gray-100">
      <div className="max-w-[1200px] mx-auto">
        {/* Progress */}
        <div className="mb-12">
            <div className="flex flex-col gap-3 max-w-[600px]">
                <div className="flex gap-6 justify-between">
                    <p className="text-[#0e141b] dark:text-white text-sm font-semibold uppercase tracking-wider">Shipping Details</p>
                    <p className="text-[#0e141b] dark:text-white text-sm font-medium">Step 1 of 3</p>
                </div>
                <div className="rounded-full bg-[#d1dbe6] dark:bg-gray-800 h-2 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '33.33%' }}></div>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-sm">
                <button onClick={() => onNavigate('cart')} className="text-[#507395] dark:text-gray-400 hover:text-primary">Cart</button>
                <span className="text-[#507395] dark:text-gray-600">/</span>
                <span className="text-[#0e141b] dark:text-white font-bold">Shipping</span>
                <span className="text-[#507395] dark:text-gray-600">/</span>
                <span className="text-[#507395] dark:text-gray-400">Payment</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-7 flex flex-col gap-10">
                <section>
                    <h1 className="text-[#0e141b] dark:text-white text-3xl font-black mb-8">Shipping Information</h1>
                    <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-bold text-[#0e141b] dark:text-white">Contact Info</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#507395] dark:text-gray-400">Email Address</label>
                            <input 
                                name="email" 
                                value={userInfo.email} 
                                onChange={handleChange} 
                                className={`w-full rounded-lg bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all ${errors.email ? 'border border-red-500 focus:border-red-500' : 'border border-[#d1dbe6] dark:border-gray-700 focus:border-primary'}`} 
                                placeholder="email@example.com" 
                                type="email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#0e141b] dark:text-white">Shipping Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#507395] dark:text-gray-400">First Name</label>
                                <input name="firstName" value={userInfo.firstName} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="John" type="text"/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#507395] dark:text-gray-400">Last Name</label>
                                <input name="lastName" value={userInfo.lastName} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="Doe" type="text"/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#507395] dark:text-gray-400">Address</label>
                            <input name="address" value={userInfo.address} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="123 Beauty Lane" type="text"/>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2 col-span-1">
                                <label className="text-sm font-medium text-[#507395] dark:text-gray-400">City</label>
                                <input name="city" value={userInfo.city} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="New York" type="text"/>
                            </div>
                            <div className="flex flex-col gap-2 col-span-1">
                                <label className="text-sm font-medium text-[#507395] dark:text-gray-400">State</label>
                                <select name="state" value={userInfo.state} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all">
                                    <option value="">Select</option>
                                    <option value="NY">NY</option>
                                    <option value="CA">CA</option>
                                    <option value="TX">TX</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 col-span-1">
                                <label className="text-sm font-medium text-[#507395] dark:text-gray-400">ZIP Code</label>
                                <input name="zip" value={userInfo.zip} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="10001" type="text"/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#507395] dark:text-gray-400">Phone</label>
                            <input name="phone" value={userInfo.phone} onChange={handleChange} className="w-full rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#0e141b] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="+1 (555) 000-0000" type="tel"/>
                        </div>
                    </div>
                </section>
                <div className="flex items-center gap-4 pt-4 border-t border-[#e8edf3] dark:border-gray-800">
                    <button 
                        onClick={handleContinue}
                        className="flex-1 bg-primary text-white text-base font-bold h-14 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        Continue to Delivery
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button onClick={() => onNavigate('cart')} className="px-8 text-[#507395] dark:text-gray-400 font-bold hover:text-[#0e141b] dark:hover:text-white transition-all h-14">
                        Return to Cart
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5 sticky top-24">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-[#e8edf3] dark:border-gray-800 shadow-sm">
                    <h2 className="text-xl font-black mb-8 text-[#0e141b] dark:text-white">Order Summary</h2>
                    <div className="space-y-6 mb-8">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative size-20 flex-shrink-0 bg-background-light dark:bg-gray-800 rounded-lg border border-[#e8edf3] dark:border-gray-700 overflow-hidden">
                                    <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-sm font-bold text-[#0e141b] dark:text-white">{item.name}</p>
                                    <p className="text-xs text-[#507395] dark:text-gray-400">Standard Edition</p>
                                    <p className="text-sm font-semibold mt-1 text-[#0e141b] dark:text-white">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4 pt-8 border-t border-[#e8edf3] dark:border-gray-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#507395] dark:text-gray-400">Subtotal</span>
                            <span className="font-bold text-[#0e141b] dark:text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#507395] dark:text-gray-400">Shipping</span>
                            <span className="text-primary font-bold">Free</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#507395] dark:text-gray-400">Estimated Tax</span>
                            <span className="font-bold text-[#0e141b] dark:text-white">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#e8edf3] dark:border-gray-800">
                            <span className="text-lg font-black text-[#0e141b] dark:text-white">Total</span>
                            <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-2">
                        <input className="flex-1 rounded-lg border-[#d1dbe6] dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm px-4 outline-none" placeholder="Promo code" type="text"/>
                        <button className="bg-[#e8edf3] dark:bg-gray-800 text-[#0e141b] dark:text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#d1dbe6] transition-colors">Apply</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShippingPage;