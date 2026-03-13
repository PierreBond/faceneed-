import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { useUserStore } from '../store';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const { setUserInfo } = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { customer } = await ApiService.customers.login(email, password);
                setUserInfo({
                    email: customer.email,
                    firstName: customer.first_name || '',
                    lastName: customer.last_name || '',
                    address: '', // These might need separate fetching if needed
                    city: '',
                    state: '',
                    zip: '',
                    phone: customer.phone || '',
                });
            } else {
                const { customer } = await ApiService.customers.register({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                });
                setUserInfo({
                    email: customer.email,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: '',
                });
            }
            navigate('/profile');
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 font-newsreader">
            <div className="w-full max-w-md bg-white dark:bg-[#1a150e] p-10 rounded-3xl shadow-2xl border border-[#f3eee7] dark:border-[#3a2f21] animate-fadeIn">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[#1b150e] dark:text-[#f8f7f6] mb-3">
                        {isLogin ? 'Welcome Back' : 'Join the Club'}
                    </h1>
                    <p className="text-[#97794e] dark:text-[#c4a67a]">
                        {isLogin ? 'Login to your Faceneed account' : 'Create an account for personalized rituals'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#97794e]">First Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-[#fcfaf7] dark:bg-[#2a2217] border border-[#f3eee7] dark:border-[#3a2f21] rounded-xl px-4 py-3 outline-none focus:border-primary text-[#1b150e] dark:text-[#f8f7f6]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#97794e]">Last Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-[#fcfaf7] dark:bg-[#2a2217] border border-[#f3eee7] dark:border-[#3a2f21] rounded-xl px-4 py-3 outline-none focus:border-primary text-[#1b150e] dark:text-[#f8f7f6]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#97794e]">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#fcfaf7] dark:bg-[#2a2217] border border-[#f3eee7] dark:border-[#3a2f21] rounded-xl px-4 py-3 outline-none focus:border-primary text-[#1b150e] dark:text-[#f8f7f6]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#97794e]">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#fcfaf7] dark:bg-[#2a2217] border border-[#f3eee7] dark:border-[#3a2f21] rounded-xl px-4 py-3 outline-none focus:border-primary text-[#1b150e] dark:text-[#f8f7f6]"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg active:scale-95"
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#97794e] hover:text-primary transition-colors font-semibold"
                    >
                        {isLogin ? "Don't have an account? Join here" : "Already a member? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
