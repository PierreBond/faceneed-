import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useUserStore } from '../store';
import { ApiService } from '../services/api';
import { ShippingOption, GHANA_DISTRICTS, detectDistrict, GhanaDistrict } from '../types';

const CheckoutShippingPage: React.FC<{
  onNavigate: (path: string) => void;
}> = ({ onNavigate }) => {
  const { cart, cartId } = useCartStore();
  const { userInfo, setUserInfo } = useUserStore();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<GhanaDistrict>('Sowutuom');
  const [windowStatus, setWindowStatus] = useState<any>(null);
  const [errors, setErrors] = useState<{ email?: string; shipping?: string; district?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0; // No tax for Ghana
  const shippingCost = selectedOption 
    ? shippingOptions.find(o => o.id === selectedOption)?.amount || 0
    : 0;
  const total = subtotal + shippingCost;

  // Auto-detect district from address
  useEffect(() => {
    if (userInfo.address) {
      const detected = detectDistrict(userInfo.address);
      if (detected) setSelectedDistrict(detected);
    }
  }, [userInfo.address]);

  // Fetch shipping options when district changes
  useEffect(() => {
    const fetchOptions = async () => {
      if (!selectedDistrict) return;
      setFetchingOptions(true);
      try {
        const { shipping_options } = await ApiService.cart.getShippingOptionsByDistrict(selectedDistrict);
        setShippingOptions(shipping_options);
        if (shipping_options.length > 0) setSelectedOption(shipping_options[0].id);
        
        // Fetch window status for shared shipping
        const sharedOption = shipping_options.find(o => o.type === 'shared');
        if (sharedOption?.metadata?.window_id) {
          const { window } = await ApiService.shipping.getWindowStatus(selectedDistrict);
          setWindowStatus(window);
        }
      } catch (err) {
        console.error("Failed to fetch shipping options:", err);
      } finally {
        setFetchingOptions(false);
      }
    };
    fetchOptions();
  }, [selectedDistrict]);

  // Update window status periodically for shared shipping
  useEffect(() => {
    const sharedOption = shippingOptions.find(o => o.type === 'shared');
    if (!sharedOption?.metadata?.window_id) return;

    const interval = setInterval(async () => {
      try {
        const { window } = await ApiService.shipping.getWindowStatus(selectedDistrict);
        setWindowStatus(window);
      } catch (err) {
        console.error("Failed to fetch window status:", err);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [selectedDistrict, shippingOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    if (name === 'address') {
      const detected = detectDistrict(value);
      if (detected) setSelectedDistrict(detected);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleDistrictChange = (district: GhanaDistrict) => {
    setSelectedDistrict(district);
    setSelectedOption('');
    setErrors(prev => ({ ...prev, district: undefined }));
  };

  const handleContinue = async () => {
    if (!userInfo.email || !validateEmail(userInfo.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address.' });
      return;
    }

    if (!selectedDistrict) {
      setErrors({ ...errors, district: 'Please select a delivery district.' });
      return;
    }

    if (!selectedOption) {
      setErrors({ ...errors, shipping: 'Please select a delivery method.' });
      return;
    }

    if (!cartId) return;

    setIsLoading(true);
    try {
      // Update Address in Medusa
      await ApiService.cart.updateAddress(cartId, {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        address_1: userInfo.address,
        city: userInfo.city || selectedDistrict,
        province: selectedDistrict,
        postal_code: userInfo.zip,
        phone: userInfo.phone,
        country_code: 'gh',
        email: userInfo.email
      });

      // Add Shipping Method
      await ApiService.cart.addShippingMethod(cartId, selectedOption);

      onNavigate('checkout-payment');
    } catch (err) {
      console.error("Checkout update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => `₵${(amount / 100).toFixed(2)}`;

  return (
    <div className="flex-1 px-6 md:px-12 lg:px-20 py-8 lg:py-12 bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100">
      <div className="w-full">
        {/* Progress */}
        <div className="mb-12">
            <div className="flex flex-col gap-3 max-w-[600px]">
                <div className="flex gap-6 justify-between">
                    <p className="text-gray-900 dark:text-white text-sm font-semibold uppercase tracking-wider">Shipping Details</p>
                    <p className="text-gray-900 dark:text-white text-sm font-medium">Step 1 of 3</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-800 h-2 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '33.33%' }}></div>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-sm">
                <Link to="/cart" className="text-gray-500 dark:text-gray-400 hover:text-primary">Cart</Link>
                <span className="text-gray-500 dark:text-gray-600">/</span>
                <span className="text-gray-900 dark:text-white font-bold">Shipping</span>
                <span className="text-gray-500 dark:text-gray-600">/</span>
                <span className="text-gray-500 dark:text-gray-400">Payment</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Form */}
            <div className="md:col-span-7 flex flex-col gap-10">
                <section>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black mb-8">Shipping Information</h1>
                    <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Info</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                            <input 
                                name="email" 
                                value={userInfo.email} 
                                onChange={handleChange} 
                                className={`w-full rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all ${errors.email ? 'border border-red-500 focus:border-red-500' : 'border border-gray-200 dark:border-gray-700 focus:border-primary'}`} 
                                placeholder="email@example.com" 
                                type="email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                <input name="firstName" value={userInfo.firstName} onChange={handleChange} className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="John" type="text"/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                <input name="lastName" value={userInfo.lastName} onChange={handleChange} className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="Doe" type="text"/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                            <input name="address" value={userInfo.address} onChange={handleChange} className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="House number, street, landmark" type="text"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">District / Area *</label>
                                <select 
                                  name="district" 
                                  value={selectedDistrict} 
                                  onChange={(e) => handleDistrictChange(e.target.value as GhanaDistrict)}
                                  className={`w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all ${errors.district ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Select delivery district</option>
                                    {GHANA_DISTRICTS.map(district => (
                                      <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">City</label>
                                <input name="city" value={userInfo.city} onChange={handleChange} className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="Accra" type="text"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ZIP / Postal Code</label>
                                <input name="zip" value={userInfo.zip} onChange={handleChange} className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="00233" type="text"/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <input name="phone" value={userInfo.phone} onChange={handleChange} className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none transition-all" placeholder="+233 XX XXX XXXX" type="tel"/>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Delivery Method</h3>
                    <div className="space-y-3">
                        {fetchingOptions ? (
                          <p className="text-gray-500 dark:text-gray-400 italic">Finding delivery options for {selectedDistrict}...</p>
                        ) : shippingOptions.length > 0 ? shippingOptions.map(option => {
                          const isShared = option.type === 'shared';
                          const meta = option.metadata || {};
                          
                          return (
                            <label 
                              key={option.id} 
                              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedOption === option.id 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
                              }`}
                            >
                              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                <input 
                                  type="radio" 
                                  name="shipping" 
                                  checked={selectedOption === option.id} 
                                  onChange={() => setSelectedOption(option.id)}
                                  className="accent-primary h-5 w-5"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900 dark:text-white">{option.name}</p>
                                    {isShared && meta.current_orders !== undefined && meta.min_orders && (
                                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                        {meta.current_orders}/{meta.min_orders} orders
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {isShared 
                                      ? `Estimated ${meta.estimated_delivery || '12-72 hours'} • From ${formatAmount(meta.fee_range?.min || option.amount)} to ${formatAmount(meta.fee_range?.max || option.amount)}`
                                      : option.metadata?.estimated_delivery || '1-2 business days'}
                                  </p>
                                  {isShared && windowStatus && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Window closes in: {windowStatus.window_closes_in}
                                      {windowStatus.final_fee_per_order && (
                                        <> • Final fee: {formatAmount(windowStatus.final_fee_per_order)}</>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white text-lg">
                                {isShared ? `From ${formatAmount(option.amount)}` : formatAmount(option.amount)}
                              </span>
                            </label>
                          );
                        }) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">No delivery options available for this district</p>
                        )}
                        {errors.shipping && <p className="text-red-500 text-xs mt-1">{errors.shipping}</p>}
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={handleContinue}
                        disabled={isLoading}
                        className="w-full sm:flex-1 bg-primary text-white text-base font-bold h-14 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Preparing Ritual...' : 'Continue to Payment'}
                        {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>
                    <Link to="/cart" className="w-full sm:w-auto px-8 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white transition-all h-14 flex items-center justify-center">
                        Return to Cart
                    </Link>
                </div>
            </div>

            {/* Summary */}
            <div className="md:col-span-5 sticky top-24">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h2 className="text-xl font-black mb-8 text-gray-900 dark:text-white">Order Summary</h2>
                    <div className="space-y-6 mb-8">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative size-20 flex-shrink-0 bg-background-light dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Standard Edition</p>
                                    <p className="text-sm font-semibold mt-1 text-gray-900 dark:text-white">₵{item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                            <span className="font-bold text-gray-900 dark:text-white">₵{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                            <span className="font-bold text-primary">{selectedOption ? formatAmount(shippingCost) : 'Select district'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Tax</span>
                            <span className="font-bold text-gray-900 dark:text-white">₵0.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                            <span className="text-2xl font-black text-primary">₵{total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-2">
                        <input className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm px-4 outline-none" placeholder="Promo code" type="text"/>
                        <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">Apply</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShippingPage;