import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useUserStore, useOrderStore } from '../store';
import { ApiService } from '../services/api';

const CheckoutPaymentPage: React.FC<{
  onNavigate: (path: string) => void;
}> = ({ onNavigate }) => {
  const { cart, cartId, clearCart } = useCartStore();
  const { userInfo } = useUserStore();
  const { addOrder } = useOrderStore();
  
  const [paymentSessions, setPaymentSessions] = React.useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  // Initialize Payment Sessions
  React.useEffect(() => {
    const initPayment = async () => {
        if (!cartId) return;
        try {
            const { cart: updatedCart } = await ApiService.cart.createPaymentSessions(cartId);
            setPaymentSessions(updatedCart.payment_sessions || []);
            if (updatedCart.payment_session) {
                setSelectedProvider(updatedCart.payment_session.provider_id);
            } else if (updatedCart.payment_sessions?.length > 0) {
                setSelectedProvider(updatedCart.payment_sessions[0].provider_id);
            }
        } catch (err) {
            console.error("Failed to initialize payment sessions:", err);
        }
    };
    initPayment();
  }, [cartId]);

  const handleComplete = async () => {
    if (!cartId || !selectedProvider) return;

    setIsLoading(true);
    setError(null);
    try {
        // Set selected session
        await ApiService.cart.setPaymentSession(cartId, selectedProvider);

        // Complete Cart
        const { type, data: orderOrCart } = await ApiService.cart.complete(cartId);
        
        if (type === 'order') {
            // Map Medusa order to internal Order type
            const newOrder = {
                id: orderOrCart.id,
                date: new Date().toLocaleDateString(),
                status: 'Processing' as any,
                total: orderOrCart.total / 100,
                items: orderOrCart.items.map((i: any) => i.thumbnail),
                customerName: `${userInfo.firstName} ${userInfo.lastName}`
            };
            addOrder(newOrder);
            clearCart();
            onNavigate('success');
        } else {
            setError("The order process is incomplete. Please try again.");
        }
    } catch (err: any) {
        console.error("Order completion failed:", err);
        setError(err.message || "Something went wrong during the checkout ritual.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 justify-center py-8 font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row w-full flex-1 gap-12 px-6 md:px-12 lg:px-20">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6">
            <Link to="/cart" className="text-primary text-sm font-medium">Information</Link>
            <span className="text-slate-400 text-sm font-medium">/</span>
            <Link to="/checkout-shipping" className="text-primary text-sm font-medium">Shipping</Link>
            <span className="text-slate-400 text-sm font-medium">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-bold">Payment</span>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold mb-8">Checkout</h1>
          <div className="mb-8">
            <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-slate-900 dark:text-white text-sm font-bold">Shipping to {userInfo.firstName || 'Guest'} {userInfo.lastName}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{userInfo.address || 'Address'} • Standard Shipping (Free)</p>
                </div>
              </div>
              <Link to="/checkout-shipping" className="text-sm font-bold tracking-tight flex items-center gap-1 text-primary hover:underline">
                Edit
                <span className="material-symbols-outlined text-sm">edit</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentSessions.length > 0 ? paymentSessions.map(session => (
                  <button 
                    key={session.id}
                    onClick={() => setSelectedProvider(session.provider_id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedProvider === session.provider_id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-primary/50'}`}
                  >
                    <span className="material-symbols-outlined">{session.provider_id === 'manual' ? 'payments' : 'credit_card'}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{session.provider_id}</span>
                  </button>
              )) : (
                <p className="text-slate-500 italic">Awakening the payment gateways...</p>
              )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-shake">
                    {error}
                </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm Phone Ritual</label>
                <div className="relative">
                  <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. 050 123 4567" type="tel" defaultValue={userInfo.phone}/>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400">contact_phone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={handleComplete}
              disabled={isLoading || !selectedProvider}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Finalizing Ritual...' : 'Complete Purchase'}
              {!isLoading && <span className="material-symbols-outlined">lock</span>}
            </button>
            <button onClick={() => onNavigate('checkout-shipping')} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to shipping
            </button>
          </div>
        </div>
        <aside className="w-full md:w-[380px]">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-800">
                      <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                    </div>
                    <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-[10px] font-bold size-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">Standard Edition</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <hr className="border-slate-100 dark:border-slate-800 my-4"/>
            <div className="flex gap-2 my-6">
              <input className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Discount code" type="text"/>
              <button className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Apply</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="text-green-600 font-medium uppercase text-xs tracking-wide">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Taxes (Estimated)</span>
                <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-900 dark:text-white uppercase tracking-tight">Total</span>
                <span className="text-slate-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              Secure checkout by Faceneed
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPaymentPage;