import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, AlertCircle, Info } from 'lucide-react';

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your MediAI Assistant. How can I help you today?", sender: 'bot', time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Rule-based logic
    const getResponse = (query) => {
        const q = query.toLowerCase();

        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return "Hello! I'm here to guide you through MediAI. You can ask me about disease prediction, consultations, or how to use the app.";
        }
        if (q.includes('predict') || q.includes('disease') || q.includes('check')) {
            return "To predict a potential disease, go to the 'Predict' section in your dashboard. You'll need to select your symptoms, and our AI will analyze them for you.";
        }
        if (q.includes('doctor') || q.includes('consult') || q.includes('talk')) {
            return "After getting a prediction, you can start a live consultation with a verified doctor. Check 'My Consultations' to see your active sessions.";
        }
        if (q.includes('help') || q.includes('how to')) {
            return "MediAI helps you identify potential health issues using AI. 1. Predict symptoms. 2. View diagnosis. 3. Consult with real doctors via secure chat.";
        }
        if (q.includes('who are you') || q.includes('what is this') || q.includes('about')) {
            return "I am MediAI Bot, an automated assistant designed to help you navigate this platform. For medical advice, please talk to our human doctors!";
        }
        if (q.includes('symptom') || q.includes('fever') || q.includes('pain')) {
            return "If you're feeling unwell, please use our 'Predict' tool or connect with a doctor immediately for a professional diagnosis.";
        }
        if (q.includes('thank')) {
            return "You're very welcome! Is there anything else I can help you with?";
        }

        return "I'm not quite sure about that. Could you try asking about 'prediction', 'doctors', or 'how it works'?";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate bot thinking
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: getResponse(input),
                sender: 'bot',
                time: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] h-[500px] glass overflow-hidden flex flex-col shadow-2xl border-white/20"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary to-secondary flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">MediAI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Always Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                        >
                            <div className="flex flex-col gap-1 mb-6 text-center opacity-40">
                                <Sparkles size={24} className="mx-auto text-primary" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Rule-Based Intelligence</p>
                            </div>

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary/20' : 'bg-white/10'}`}>
                                            {msg.sender === 'user' ? <User size={12} className="text-white" /> : <Bot size={12} className="text-white" />}
                                        </div>
                                        <div className={`px-3 py-2 rounded-2xl text-[13px] font-medium ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white/10 border border-white/10 text-white rounded-bl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Warning Footer */}
                        <div className="px-4 py-2 bg-rose-500/10 border-t border-white/5 flex items-center gap-2">
                            <AlertCircle size={12} className="text-rose-400 shrink-0" />
                            <p className="text-[9px] text-rose-300 font-bold uppercase tracking-tight">Not a substitute for human diagnosis</p>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask me something..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-10 h-10 bg-primary hover:bg-secondary disabled:opacity-30 rounded-xl flex items-center justify-center transition-all shadow-lg"
                            >
                                <Send size={18} className="text-white" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-rose-500' : 'bg-primary'}`}
            >
                {isOpen ? <X className="text-white" /> : <MessageCircle className="text-white" />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                )}
            </motion.button>
        </div>
    );
};

export default FloatingChatbot;
