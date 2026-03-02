import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    History,
    MessageSquare,
    User as UserIcon,
    ChevronRight,
    Activity,
    Calendar,
    Layers,
    ArrowUpRight,
    ShieldAlert,
    Dna
} from 'lucide-react';
import { mainService } from '../services/api';

const PatientDashboard = ({ user }) => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await mainService.getConsultations();
            setConsultations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const activeCount = consultations.filter(c => c.status === 'active').length;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldAlert size={12} /> Live Patient Portal
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">Welcome, <span className="text-primary">{user.profile.name?.split(' ')[0] || user.username}</span></h1>
                    <p className="text-slate-400 font-light mt-2 max-w-lg">Manage your health profile, review diagnostic history, and communicate with your specialists.</p>
                </div>
                <Link to="/predict" className="btn-gradient no-underline flex items-center gap-2 px-8">
                    New Diagnosis <Dna size={20} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Explorer */}
                <motion.div
                    className="lg:col-span-1 glass p-10 space-y-8 relative overflow-hidden group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserIcon size={120} />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <UserIcon className="text-primary" size={28} />
                        </div>

                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Account Profile</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Verified Member</p>
                        </div>

                        <div className="space-y-4 pt-4">
                            {[
                                { label: 'Identifier', value: user.username },
                                { label: 'Gender', value: user.profile.gender || 'Not specified' },
                                { label: 'Birth Registry', value: user.profile.dob || 'Not specified' },
                                { label: 'Contact', value: user.profile.mobile_no || 'Not specified' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col border-l-2 border-white/5 pl-4 py-1">
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{item.label}</span>
                                    <span className="text-sm font-bold text-white tracking-tight">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all mt-4">
                            Update Profile
                        </button>
                    </div>
                </motion.div>

                {/* Dynamic Activity Feed */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 group hover:border-emerald-500/50 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                    <Activity size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> LIVE
                                </div>
                            </div>
                            <div className="text-4xl font-black mb-1">{activeCount}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Consultations</div>
                        </div>

                        <div className="glass p-8 group hover:border-primary/50 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Layers size={24} />
                                </div>
                            </div>
                            <div className="text-4xl font-black mb-1">{consultations.length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Historical Records</div>
                        </div>
                    </div>

                    {/* History List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight">Medical Journal</h2>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Recent Items</div>
                        </div>

                        <div className="glass border-white/10 overflow-hidden">
                            {loading ? (
                                <div className="p-20 flex justify-center">
                                    <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            ) : consultations.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {consultations.map((c) => (
                                        <div key={c.id} className="p-8 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                                            <div className="flex items-center gap-8">
                                                <div className={`p-4 rounded-2xl relative ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                                                    <MessageSquare size={24} />
                                                    {c.status === 'active' && <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-4 border-dark ring-2 ring-emerald-500/20 translate-x-1 -translate-y-1"></div>}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-lg font-black tracking-tight">{c.diseaseinfo?.diseasename}</span>
                                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/10 text-slate-500'
                                                            }`}>
                                                            {c.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                                        <span className="flex items-center gap-1.5"><History size={14} className="opacity-50" /> Dr. {c.doctor?.name}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                        <span>{new Date(c.consultation_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/consultation/${c.id}`}
                                                className="flex items-center gap-2 text-primary hover:text-white no-underline text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0"
                                            >
                                                Launch Session <ArrowUpRight size={18} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center space-y-6">
                                    <div className="w-16 h-16 mx-auto bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                                        <Layers size={32} className="text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-slate-300">Journal is empty</p>
                                        <p className="text-sm text-slate-500 font-light max-w-xs mx-auto">Your medical consultation and prediction history will appear here once you start your first analysis.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
