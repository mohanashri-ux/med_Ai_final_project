import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, HeartPulse, BrainCircuit, ChevronRight, Play } from 'lucide-react';

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <motion.div
                    className="flex-1 text-center lg:text-left space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-400 text-sm font-semibold tracking-wide animate-pulse-slow">
                        <Zap size={16} className="fill-current" />
                        <span>AI-POWERED DIAGNOSTIC ENGINE v2.0</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                        Advanced Healthcare <br />
                        <span className="gradient-text">Redefined by AI</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Bridging the gap between symptoms and care. Get high-precision disease analysis and instant specialist connection within seconds.
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                        <Link to="/register" className="btn-gradient no-underline flex items-center gap-3 px-10">
                            Start Diagnosis <ChevronRight size={22} />
                        </Link>
                        <Link to="/login" className="px-10 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 no-underline text-white font-bold flex items-center gap-2">
                            <Play size={18} className="fill-current" /> Watch Demo
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60">
                        <div className="text-center">
                            <div className="text-2xl font-bold">98%</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Accuracy</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">12k+</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Patients</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">500+</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Doctors</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="flex-1 relative group"
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <div className="relative z-10 glass p-3 border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_80px_rgba(99,102,241,0.3)] transition-all duration-700">
                        <img
                            src="/hero.png"
                            alt="Medical Interface"
                            className="w-full h-auto rounded-xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-darker/80 to-transparent rounded-b-xl"></div>
                    </div>

                    {/* Floating cards */}
                    <motion.div
                        className="absolute -top-6 -right-6 glass p-4 space-y-2 animate-float"
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">Live Analysis</span>
                        </div>
                        <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-emerald-500"></div>
                        </div>
                    </motion.div>

                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-10"></div>
                </motion.div>
            </div>

            {/* Feature Grid */}
            <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <BrainCircuit className="text-primary" size={28} />,
                        title: "Smart Triage",
                        desc: "Clinical-grade algorithms that understand complex symptom patterns instantly."
                    },
                    {
                        icon: <ShieldCheck className="text-emerald-400" size={28} />,
                        title: "Data Sovereignty",
                        desc: "End-to-end encryption ensures your medical history remains yours alone."
                    },
                    {
                        icon: <HeartPulse className="text-accent" size={28} />,
                        title: "Seamless Referral",
                        desc: "Direct handover to verified specialists based on your unique health profile."
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        className="glass-card p-10 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/10">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            {feature.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
