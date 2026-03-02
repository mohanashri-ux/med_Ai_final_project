import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Phone, MapPin, Calendar, Stethoscope, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

const Register = () => {
    const [role, setRole] = useState('patient');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
        dob: '',
        gender: 'Male',
        address: '',
        mobile: '',
        registration_no: '',
        year_of_registration: '',
        qualification: '',
        State_Medical_Council: '',
        specialization: 'Gastroenterologist'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Password confirmation mismatch.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            if (role === 'patient') {
                await authService.registerPatient(formData);
            } else {
                await authService.registerDoctor(formData);
            }
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registry entry failed. Please verify all data points.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex justify-center">
            <motion.div
                className="glass w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Sidebar Info */}
                <div className="lg:col-span-4 bg-gradient-to-br from-primary/20 to-secondary/10 p-12 border-r border-white/10 hidden lg:block relative">
                    <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm -z-10"></div>
                    <div className="space-y-12 h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20">
                                <CheckCircle className="text-white" size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black leading-tight tracking-tighter">Clinical Registry</h3>
                                <p className="text-slate-400 font-light text-sm italic">"Precision healthcare begins with precise data."</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                "Instant AI Diagnostic Access",
                                "Verified Practitioner Support",
                                "Secure Medical Journaling",
                                "Global Health Insights"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-all group-hover:scale-125"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 opacity-40 grayscale">
                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">MediAI Authentication Node 01</span>
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="lg:col-span-8 p-12">
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-1">Create Profile</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select user classification level</p>
                        </div>

                        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-auto">
                            <button
                                onClick={() => setRole('patient')}
                                className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-black uppercase tracking-widest ${role === 'patient' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                Patient
                            </button>
                            <button
                                onClick={() => setRole('doctor')}
                                className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-black uppercase tracking-widest ${role === 'doctor' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                Doctor
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-accent/5 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest leading-normal">
                            Error Profile: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Form Fields */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Unique Username</label>
                            <input name="username" type="text" className="input-premium py-2.5 text-sm" required value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Clinical Email</label>
                            <input name="email" type="email" className="input-premium py-2.5 text-sm" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Security Key</label>
                            <input name="password" type="password" className="input-premium py-2.5 text-sm" required value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Confirm Identity Key</label>
                            <input name="confirmPassword" type="password" className="input-premium py-2.5 text-sm" required value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Full Legal Name</label>
                            <input name="name" type="text" className="input-premium py-2.5 text-sm" required value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Date of Registry</label>
                            <input name="dob" type="date" className="input-premium py-2.5 text-sm" required value={formData.dob} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Contact Signal</label>
                            <input name="mobile" type="tel" className="input-premium py-2.5 text-sm" required value={formData.mobile} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Gender</label>
                            <select name="gender" className="input-premium py-2.5 text-sm bg-darker" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Primary Residency Address</label>
                            <input name="address" type="text" className="input-premium py-2.5 text-sm" required value={formData.address} onChange={handleChange} />
                        </div>

                        <AnimatePresence mode="wait">
                            {role === 'doctor' && (
                                <motion.div
                                    className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-white/5"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-rose-400 tracking-widest pl-1">License Plate</label>
                                        <input name="registration_no" type="text" className="input-premium py-2.5 text-sm border-rose-500/20" required value={formData.registration_no} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-rose-400 tracking-widest pl-1">License Date</label>
                                        <input name="year_of_registration" type="date" className="input-premium py-2.5 text-sm border-rose-500/20" required value={formData.year_of_registration} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-rose-400 tracking-widest pl-1">Credentials</label>
                                        <input name="qualification" type="text" className="input-premium py-2.5 text-sm border-rose-500/20" required value={formData.qualification} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-rose-400 tracking-widest pl-1">Council Node</label>
                                        <input name="State_Medical_Council" type="text" className="input-premium py-2.5 text-sm border-rose-500/20" required value={formData.State_Medical_Council} onChange={handleChange} />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[10px] font-black uppercase text-rose-400 tracking-widest pl-1">Primary Specialization</label>
                                        <select name="specialization" className="input-premium py-2.5 text-sm bg-darker border-rose-500/20" value={formData.specialization} onChange={handleChange}>
                                            {["Rheumatologist", "Cardiologist", "ENT specialist", "Orthopedist", "Neurologist", "Allergist/Immunologist", "Urologist", "Dermatologist", "Gastroenterologist"].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="md:col-span-2 pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl relative group ${role === 'patient' ? 'bg-primary shadow-primary/20' : 'bg-rose-500 shadow-rose-500/20'
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Commit Registry</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
