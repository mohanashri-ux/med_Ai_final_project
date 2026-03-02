import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, LogIn, AlertCircle, User, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.login(formData.username, formData.password);
            await onLogin();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid identification. Please verify your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
            <div className="w-full max-w-lg relative">
                {/* Background glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10"></div>

                <motion.div
                    className="glass p-12 relative z-10 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12 space-y-3">
                        <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4 border border-primary/20">
                            <ShieldCheck className="text-primary w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">Access <span className="text-primary">Portal</span></h2>
                        <p className="text-slate-400 font-light">Secure identification for patients and medical professionals</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="mb-8 p-4 rounded-xl bg-accent/5 border border-accent/20 text-accent flex items-start gap-3"
                        >
                            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <div className="text-xs font-bold leading-normal">{error}</div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Unique Identifier</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="input-premium pl-12 bg-darker/50"
                                    placeholder="Username"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    className="input-premium pl-12 bg-darker/50"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gradient w-full py-4 text-lg font-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(99,102,241,0.2)] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center space-y-4">
                        <p className="text-slate-500 text-sm font-light">
                            Don't have an active account?
                        </p>
                        <Link to="/register" className="inline-flex items-center gap-2 text-primary hover:text-white font-black text-sm transition-all group">
                            Register New Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
