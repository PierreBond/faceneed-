import React from 'react';
import { PageView, CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, updateQuantity, removeFromCart, onNavigate }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free
  const delivery = 8.46;
  const total = subtotal + shipping + delivery;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 lg:px-40 py-12 font-newsreader">
      <h1 className="text-[#1b150e] dark:text-[#f8f7f6] text-4xl font-bold leading-tight tracking-[-0.033em] mb-10">Your Shopping Bag</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-6">Your bag is empty.</p>
          <button onClick={() => onNavigate('shop')} className="bg-primary text-[#211a11] px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">Start Shopping</button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 w-full space-y-8">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col border-b border-[#f3eee7] dark:border-[#3a2f21] pb-8">
                <div className="flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-6">
                    <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-24 md:size-32 bg-[#f3eee7]" 
                        style={{ backgroundImage: `url("${item.image}")` }}
                    ></div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xl font-semibold leading-normal text-[#1b150e] dark:text-[#f8f7f6]">{item.name}</p>
                      <p className="text-[#97794e] dark:text-[#c4a67a] text-sm font-normal">Size: 30ml</p> {/* Hardcoded for demo match */}
                      <p className="text-lg font-medium mt-2 text-[#1b150e] dark:text-[#f8f7f6]">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="shrink-0">
                      <div className="flex items-center gap-3 bg-[#f3eee7] dark:bg-[#3a2f21] px-3 py-1.5 rounded-full">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-lg font-bold flex h-6 w-6 items-center justify-center rounded-full hover:text-primary transition-colors text-[#1b150e] dark:text-[#f8f7f6]">-</button>
                        <span className="text-sm font-bold w-6 text-center text-[#1b150e] dark:text-[#f8f7f6]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-lg font-bold flex h-6 w-6 items-center justify-center rounded-full hover:text-primary transition-colors text-[#1b150e] dark:text-[#f8f7f6]">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="flex items-center text-[#97794e] hover:text-red-500 transition-colors text-sm font-semibold gap-1">
                      <span className="material-symbols-outlined text-lg">delete</span>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <aside className="w-full lg:w-96 sticky top-32">
            <div className="bg-white dark:bg-[#2a2217] p-8 rounded-2xl shadow-sm border border-[#f3eee7] dark:border-[#3a2f21]">
              <h3 className="text-2xl font-bold mb-6 text-[#1b150e] dark:text-[#f8f7f6]">Order Summary</h3>
              <div className="space-y-4 mb-6 border-b border-[#f3eee7] dark:border-[#3a2f21] pb-6">
                <div className="flex justify-between text-base">
                  <span className="text-[#97794e] dark:text-[#c4a67a]">Subtotal</span>
                  <span className="font-medium text-[#1b150e] dark:text-[#f8f7f6]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-[#97794e] dark:text-[#c4a67a]">Estimated Shipping</span>
                  <span className="font-medium text-[#1b150e] dark:text-[#f8f7f6]">Free</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-[#97794e] dark:text-[#c4a67a]">Delivery Cost</span>
                  <span className="font-medium text-[#1b150e] dark:text-[#f8f7f6]">${delivery}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-[#1b150e] dark:text-[#f8f7f6]">Total</span>
                <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => onNavigate('checkout-shipping')}
                className="w-full bg-primary text-[#211a11] py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 mb-4"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-3 text-sm text-[#97794e] dark:text-[#c4a67a]">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <span>Secure encrypted payment.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#97794e] dark:text-[#c4a67a]">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <span>Free standard shipping on all orders.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;