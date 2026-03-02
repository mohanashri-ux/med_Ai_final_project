import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LogOut, LayoutDashboard, BrainCircuit, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto glass px-8 py-3 flex items-center justify-between border-white/20 bg-darker/60">
                <Link to="/" className="flex items-center gap-3 no-underline group">
                    <div className="relative">
                        <Activity className="text-primary w-9 h-9 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">Medi<span className="text-primary">AI</span></span>
                </Link>

                <div className="flex items-center gap-8">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-6">
                                <Link
                                    to={user.role === 'patient' ? '/patient-ui' : '/doctor-ui'}
                                    className={`flex items-center gap-2 text-sm font-bold no-underline transition-all ${isActive('/patient-ui') || isActive('/doctor-ui') ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>

                                {user.role === 'patient' && (
                                    <Link
                                        to="/predict"
                                        className={`flex items-center gap-2 text-sm font-bold no-underline transition-all ${isActive('/predict') ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <BrainCircuit size={18} />
                                        <span>Diagnostics</span>
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center gap-5 pl-8 border-l border-white/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-white leading-tight">{user.username}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none mt-1 ${user.role === 'doctor' ? 'text-rose-400' : 'text-primary'}`}>
                                        {user.role} Portal
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all active:scale-95 group"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white no-underline transition-colors">Sign In</Link>
                            <Link to="/register" className="btn-gradient no-underline py-2.5 px-6 text-sm">Join MediAI</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
