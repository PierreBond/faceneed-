import React from 'react';
import { PageView, UserInfo } from '../types';

interface OrderSuccessPageProps {
  userInfo: UserInfo;
  onNavigate: (page: PageView) => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ userInfo, onNavigate }) => {
  return (
    <div className="flex flex-1 justify-center py-12 px-4 font-display bg-background-light dark:bg-background-dark">
      <div className="max-w-[640px] w-full flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="mb-8 flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/20">
          <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
        </div>
        <h1 className="text-[#1c180d] dark:text-[#f8f8f5] text-3xl md:text-4xl font-extrabold mb-2">Thank you for your order!</h1>
        <p className="text-primary font-bold text-sm tracking-wider uppercase mb-6">Order #FN-82934102</p>
        <div className="bg-white dark:bg-[#2c2818] p-8 rounded-xl border border-[#e5e5e0] dark:border-[#3a3420] w-full shadow-sm mb-10">
          <p className="text-[#5c584d] dark:text-[#c4c0b5] text-base leading-relaxed mb-8">
            A confirmation email has been sent to <span className="font-bold text-[#1c180d] dark:text-white">{userInfo.email || 'your-email@example.com'}</span>. We'll notify you when your items are on their way.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left border-t border-[#f4f0e7] dark:border-[#3a3420] pt-8">
            <div>
              <h3 className="text-[#1c180d] dark:text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">local_shipping</span> Delivery Address
              </h3>
              <div className="text-[#5c584d] dark:text-[#c4c0b5] text-sm leading-relaxed">
                <p className="font-semibold text-[#1c180d] dark:text-white">{userInfo.firstName || 'Sarah'} {userInfo.lastName || 'Jenkins'}</p>
                <p>{userInfo.address || '123 Serenity Boulevard'}</p>
                <p>{userInfo.city || 'Los Angeles'}, {userInfo.state || 'CA'} {userInfo.zip || '90028'}</p>
                <p>United States</p>
              </div>
            </div>
            <div>
              <h3 className="text-[#1c180d] dark:text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">payments</span> Payment Method
              </h3>
              <div className="text-[#5c584d] dark:text-[#c4c0b5] text-sm leading-relaxed">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background-light dark:bg-background-dark/50 border border-[#f4f0e7] dark:border-[#3a3420]">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                  <div>
                    <p className="font-semibold text-[#1c180d] dark:text-white">Mobile Money</p>
                    <p className="text-xs">Transaction ID: 9872134</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={() => onNavigate('shop')}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-lg transition-all shadow-md active:scale-95"
          >
            Continue Shopping
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#2c2818] hover:bg-background-light dark:hover:bg-[#3a3420] text-[#1c180d] dark:text-white font-bold py-4 px-10 rounded-lg border border-[#e5e5e0] dark:border-[#3a3420] transition-all shadow-sm">
            <span className="material-symbols-outlined">description</span>
            View Receipt
          </button>
        </div>
        <div className="mt-12 text-[#9c8749] text-xs flex items-center gap-2 justify-center">
          <span className="material-symbols-outlined text-sm">lock</span>
          Secure transaction provided by Faceneed Checkout
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;