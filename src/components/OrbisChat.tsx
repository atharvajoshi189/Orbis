"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MessageSquare, User, Bot, Sparkles, TrendingUp, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { VoiceAssistant } from "@/components/VoiceAssistant";

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isTyping?: boolean;
};

interface OrbisChatProps {
    isWidget?: boolean;
    onClose?: () => void;
}

export function OrbisChat({ isWidget = false, onClose }: OrbisChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [trajectory, setTrajectory] = useState(10); // Start at 10%
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load initial history (Only if logged in)
    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('chat_history')
                    .select('*')
                    .eq('student_id', user.id)
                    .order('created_at', { ascending: true });

                if (data) {
                    setMessages(data.map(msg => ({ role: msg.role, content: msg.content })));
                }
            } else {
                // Guest greeting
                setMessages([{ role: 'assistant', content: "Hello! I'm Orbis. I can help you with career guidance. Sign in to save our conversation!" }]);
            }
        };
        fetchHistory();
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Analyze input for trajectory boost
        const keywords = ['10th', '12th', 'engineering', 'sat', 'gre', 'job', 'salary', 'roi'];
        if (keywords.some(k => input.toLowerCase().includes(k))) {
            setTrajectory(prev => Math.min(prev + 15, 100));
        }

        try {
            // Sanitize messages to only include role and content
            const cleanMessages = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: cleanMessages, studentYear: "Guest" }),
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const aiMsgData = await res.json();

            // Start Typing Effect
            simulateTypingEffect(aiMsgData.content);

            // Save to Supabase (Only if logged in)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('chat_history').insert([
                    { student_id: user.id, role: 'user', content: userMsg.content },
                    { student_id: user.id, role: 'assistant', content: aiMsgData.content }
                ]);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the main server. Please try again." }]);
            setIsLoading(false);
        }
    };

    const simulateTypingEffect = (fullText: string) => {
        setIsLoading(false); // Stop loading spinner, start typing
        const newMsg: Message = { role: 'assistant', content: '', isTyping: true };
        setMessages(prev => [...prev, newMsg]);

        let i = 0;
        const intervalId = setInterval(() => {
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg.role === 'assistant' && lastMsg.isTyping) {
                    const updatedContent = fullText.substring(0, i + 1);
                    return [...prev.slice(0, -1), { ...lastMsg, content: updatedContent }];
                }
                return prev;
            });
            i++;
            if (i === fullText.length) {
                clearInterval(intervalId);
                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...lastMsg, isTyping: false }];
                });
            }
        }, 15); // Adjust typing speed here
    };

    const handleVoiceMessage = (role: 'user' | 'assistant', content: string) => {
        setMessages(prev => [...prev, { role, content }]);
    };

    return (
        <div className={cn(
            "flex bg-white dark:bg-[#0a0f1e] overflow-hidden border border-slate-200 dark:border-white/10 mx-auto transition-all duration-300",
            isWidget ? "h-full w-full rounded-2xl shadow-none border-0" : "h-[85vh] w-full max-w-[95%] rounded-2xl shadow-2xl border-slate-200 dark:border-white/10"
        )}>
            {/* Voice Mode Overlay */}
            <AnimatePresence>
                {isVoiceMode && (
                    <VoiceAssistant
                        onClose={() => setIsVoiceMode(false)}
                        onNewMessage={handleVoiceMessage}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar / Trajectory Panel - Hidden in Widget Mode */}
            {!isWidget && (
                <div className="w-80 bg-slate-50 dark:bg-black/40 border-r border-slate-200 dark:border-white/10 p-6 hidden md:flex flex-col transition-colors">
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp size={14} /> Career Trajectory
                        </h3>
                        <div className="relative pt-2">
                            <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    initial={{ width: "10%" }}
                                    animate={{ width: `${trajectory}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                                <span>Analysis</span>
                                <span>Ready</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-slate-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History size={14} /> Recent Intel
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-600 dark:text-gray-300 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:translate-x-1">
                                <span className="font-bold block text-slate-800 dark:text-white">Engineering ROI</span>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black">2 hours ago</span>
                            </div>
                            <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-600 dark:text-gray-300 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:translate-x-1">
                                <span className="font-bold block text-slate-800 dark:text-white">Visa Requirements</span>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-black/20 relative transition-colors">

                {/* Header */}
                <div className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <Bot size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Orbis Intelligence</h2>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                                Satellite Link Active
                            </p>
                        </div>
                    </div>
                    {isWidget && onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                            <X size={20} />
                        </Button>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8" ref={scrollRef}>

                    {/* Welcome Message */}
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 px-8 py-6 rounded-3xl rounded-tl-none max-w-[85%] shadow-sm transition-colors">
                            <p className="mb-3 font-black text-slate-900 dark:text-white text-xl tracking-tight">System Initialization Complete.</p>
                            <p className="text-base leading-relaxed font-medium">I specialize in engineering career paths and ROI analysis. Whether you're in 10th grade or final year, I can help plan your next move using real-time market data.</p>
                        </div>
                    </div>

                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[85%] px-8 py-6 rounded-3xl shadow-lg text-sm md:text-base leading-relaxed transition-all",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none shadow-blue-500/20 font-medium"
                                    : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-200 rounded-tl-none prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-black prose-strong:font-black prose-ul:list-disc prose-ol:list-decimal"
                            )}>
                                {msg.role === 'assistant' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content + (msg.isTyping ? " |" : "")}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3 transition-colors">
                                <Sparkles size={18} className="text-blue-500 animate-spin" />
                                <span className="text-sm text-slate-500 dark:text-gray-400 italic font-medium uppercase tracking-widest">Synchronizing...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white dark:bg-[#0a0f1e] border-t border-slate-200 dark:border-white/10 shrink-0 transition-colors">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex items-center gap-3 max-w-4xl mx-auto relative bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 px-3 py-3 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 dark:focus-within:border-blue-500/50 transition-all shadow-sm hover:border-blue-300 dark:hover:border-blue-500/30"
                    >
                        <div className="pl-3 text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                            <MessageSquare size={22} />
                        </div>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about ROI, Universities, or Career Paths..."
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 h-12 px-2 text-base font-bold"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsVoiceMode(true)}
                            className="text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all h-12 w-12"
                        >
                            <Mic size={22} />
                        </Button>
                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl h-12 w-12 shadow-xl shadow-blue-600/20 transition-all hover:shadow-blue-600/40 hover:scale-105 active:scale-95",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={isLoading}
                        >
                            <Send size={20} className={isLoading ? "opacity-0" : "opacity-100"} />
                        </Button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-[10px] text-slate-400 dark:text-gray-600 font-black tracking-widest uppercase flex items-center justify-center gap-2">
                            <Sparkles size={12} className="text-blue-400 dark:text-blue-900" />
                            Neural Intelligence Module v2.4 Active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
