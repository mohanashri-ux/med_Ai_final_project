import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users,
    MessageSquare,
    Activity,
    Clock,
    CheckCircle,
    ChevronRight,
    Stethoscope,
    Star,
    ShieldCheck,
    LayoutDashboard
} from 'lucide-react';
import { mainService } from '../services/api';

const DoctorDashboard = ({ user }) => {
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

    const activeConsults = consultations.filter(c => c.status === 'active');
    const completedCount = consultations.filter(c => c.status === 'closed').length;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldCheck size={12} /> Security-Verified Practitioner
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">Dr. <span className="text-primary">{user.profile.name || user.username}</span></h1>
                    <p className="text-slate-400 font-light mt-2 max-w-lg">{user.profile.specialization} • Clinical Performance Intelligence</p>
                </div>

                <div className="flex gap-4">
                    <div className="glass px-6 py-4 flex flex-col items-center justify-center border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-500/5 -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="text-yellow-400 fill-yellow-400" size={18} />
                            <span className="text-2xl font-black text-white">{user.profile.rating || '5.0'}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rating</span>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    { icon: <Clock className="text-rose-400" />, label: 'Wait List', value: activeConsults.length, color: 'rose' },
                    { icon: <CheckCircle className="text-emerald-400" />, label: 'Resolved', value: completedCount, color: 'emerald' },
                    { icon: <Users className="text-primary" />, label: 'Registry', value: new Set(consultations.map(c => c.patient?.id)).size, color: 'indigo' },
                    { icon: <Activity className="text-amber-400" />, label: 'Feedback', value: 0, color: 'amber' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        className="glass-card p-8 border-white/5 relative overflow-hidden group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all transform group-hover:scale-150`}>
                            {stat.icon}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:ring-white/20 transition-all`}>
                            {React.cloneElement(stat.icon, { size: 24 })}
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-outfit">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight">Active In-take Queue</h2>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> Processing Live
                    </div>
                </div>

                <div className="glass border-white/10 overflow-hidden bg-darker/20">
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : activeConsults.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {activeConsults.map((c) => (
                                <div key={c.id} className="p-8 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-slate-700 group-hover:text-primary transition-colors">
                                            {c.patient?.name?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <div className="font-black text-xl mb-1 group-hover:translate-x-1 transition-transform">{c.patient?.name || 'Subject Identifier'}</div>
                                            <div className="text-xs font-medium text-slate-500 flex items-center gap-4">
                                                <span className="flex items-center gap-2 text-rose-400/80 font-bold uppercase tracking-wider text-[10px]"><Activity size={14} /> {c.diseaseinfo?.diseasename}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span>Registry: {new Date(c.consultation_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/consultation/${c.id}`}
                                        className="btn-gradient no-underline flex items-center gap-2 px-6 py-2.5 text-[10px]"
                                    >
                                        Resume Analysis
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center space-y-6">
                            <div className="w-20 h-20 mx-auto bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 opacity-30">
                                <LayoutDashboard size={40} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-slate-300">Queue is Clear</p>
                                <p className="text-sm text-slate-500 font-light">No active patient intakes at this moment. New requests will appear here automatically.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
