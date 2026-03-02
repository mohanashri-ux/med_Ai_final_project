import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    User as UserIcon,
    Stethoscope,
    MessageSquare,
    XCircle,
    ChevronLeft,
    Activity,
    Shield,
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Mic,
    Video,
    MoreVertical,
    Lock,
    Fingerprint,
    Pill,
    Thermometer,
    Droplets,
    Wind,
    Radio,
    Scan,
    ShieldCheck,
    Server,
    Paperclip
} from 'lucide-react';
import { chatService, mainService, medicineService } from '../services/api';

const Consultation = ({ user }) => {
    const { id: rawId } = useParams();
    const id = useMemo(() => rawId?.replace(':', ''), [rawId]);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [consultation, setConsultation] = useState(null);
    const [drug, setDrug] = useState(null);
    const [loading, setLoading] = useState(true);

    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchConsultation();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConsultation = async () => {
        try {
            const data = await mainService.getConsultations();
            const current = data.find(c => c.id === parseInt(id));
            setConsultation(current);
            if (current?.diseaseinfo?.diseasename) {
                try {
                    const drugRes = await medicineService.search(current.diseaseinfo.diseasename);
                    setDrug(drugRes.drug);
                } catch (e) { console.error("Drug search error", e); }
            }
            fetchMessages();
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchMessages = async () => {
        try {
            const data = await chatService.getMessages(id);
            setMessages(data);
        } catch (err) { console.error(err); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const text = newMessage;
        setNewMessage('');
        try {
            await chatService.sendMessage(id, text);
            fetchMessages();
        } catch (err) { console.error(err); }
    };

    const handleClose = async () => {
        if (window.confirm('Terminate this clinical consultation session?')) {
            try {
                await mainService.closeConsultation(id);
                navigate(user?.role === 'patient' ? '/patient-ui' : '/doctor-ui');
            } catch (err) { console.error(err); }
        }
    };

    const otherUser = useMemo(() =>
        user?.role === 'patient' ? consultation?.doctor : consultation?.patient
        , [user, consultation]);

    if (loading || !consultation) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 relative">
            <div className="mesh-glow" /> {/* Using your project's custom background */}

            {/* Top Security Banner */}
            <div className="fixed top-0 left-0 right-0 bg-slate-950/60 backdrop-blur-md border-b border-white/5 z-50 px-6 py-2">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-bold tracking-widest text-white uppercase">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 text-emerald-400"><ShieldCheck size={12} /> Secure AES-256</span>
                        <span className="flex items-center gap-1.5"><Lock size={12} /> End-to-End Encrypted</span>
                        <span className="flex items-center gap-1.5"><Server size={12} /> HIPAA Compliant Node</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Session</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-6 h-screen flex flex-col gap-6 relative">

                {/* Header Card */}
                <div className="glass p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                    {user?.role === 'patient' ? <Stethoscope size={28} className="text-white" /> : <UserIcon size={28} className="text-white" />}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${consultation.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-white">{otherUser?.name || 'Practitioner'}</h2>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mt-0.5">
                                    {user?.role === 'patient' ? consultation.doctor?.specialization : 'Verified Clinical Patient'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-white uppercase">Session</p>
                                <p className="text-xs font-bold font-mono text-white">#{consultation.id}</p>
                            </div>
                            <div className="w-px h-6 bg-white/20" />
                            <div className="text-center">
                                <p className="text-[10px] font-black text-white uppercase">Status</p>
                                <p className="text-xs font-bold text-emerald-400">ACTIVE</p>
                            </div>
                        </div>
                        {consultation.status === 'active' && (
                            <button onClick={handleClose} className="btn-gradient !py-2.5 !px-5 text-xs flex items-center gap-2">
                                <XCircle size={16} /> End Session
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col glass overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 bg-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={18} className="text-white" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">Secure Consultation Channel</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Video size={18} className="text-white cursor-pointer hover:text-white" />
                                <Mic size={18} className="text-white cursor-pointer hover:text-white ml-2" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-50 text-center space-y-4">
                                        <Radio size={48} className="text-white" />
                                        <p className="font-outfit font-black uppercase tracking-widest text-sm text-white">Awaiting Signal Transmission</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.sender === user?.id ? 'bg-primary border border-white/20 text-white' : 'bg-white/10 border border-white/20 text-white'}`}>
                                                <p className="text-sm font-medium">{msg.message}</p>
                                                <p className="text-[10px] mt-1 opacity-70 font-bold">{new Date(msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white/5 border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="input-premium pr-20"
                                    placeholder="Enter encrypted clinical message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button type="button" className="p-2 text-white hover:text-white transition-colors">
                                        <Paperclip size={18} />
                                    </button>
                                    <button type="submit" disabled={!newMessage.trim()} className="p-2 text-white hover:text-white disabled:opacity-30">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0 overflow-y-auto">
                        <div className="glass-card p-6 space-y-6">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText size={14} /> Case Analytics
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                                    <div className="text-[10px] font-black text-white mb-1 uppercase tracking-widest">Diagnosis</div>
                                    <div className="text-xl font-black text-white">{consultation.diseaseinfo?.diseasename}</div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-white" style={{ width: `${consultation.diseaseinfo?.confidence}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-white">{consultation.diseaseinfo?.confidence}%</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-black text-white mb-3 uppercase tracking-widest">Symptoms Identified</div>
                                    <div className="flex flex-wrap gap-2">
                                        {consultation.diseaseinfo?.symptomsname?.map((s, i) => (
                                            <span key={i} className="px-3 py-1.5 text-[10px] font-bold bg-white/10 border border-white/20 rounded-lg text-white capitalize">
                                                {s.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                                        <Thermometer size={14} className="text-rose-400 mb-2" />
                                        <p className="text-[10px] font-black text-white uppercase">Temp</p>
                                        <p className="text-sm font-bold text-white">98.6 °F</p>
                                    </div>
                                    <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                                        <Activity size={14} className="text-emerald-400 mb-2" />
                                        <p className="text-[10px] font-black text-white uppercase">BPM</p>
                                        <p className="text-sm font-bold text-white">72</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {drug && (
                            <div className="glass-card p-6 border-white/20">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Pill size={14} /> Intelligence Suggestion
                                </h3>
                                <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                                    <p className="text-sm font-black text-white mb-1">{drug}</p>
                                    <p className="text-[10px] text-white font-medium">Auto-cross-referenced with clinical databases.</p>
                                    <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase text-white tracking-widest rounded-lg transition-colors">
                                        Details Analysis
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="glass p-5 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white">Privacy Mode</span>
                                <span className="text-emerald-400">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white">Record Logs</span>
                                <span className="text-white">Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="fixed bottom-4 left-6 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">© 2026 MedIAI Intelligence</p>
            </div>
        </div>
    );
};

export default Consultation;