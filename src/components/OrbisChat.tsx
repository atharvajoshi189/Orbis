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

            // Get current user ID from Supabase auth (more reliable than store for API calls if session exists)
            const { data: { user } } = await supabase.auth.getUser();

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: cleanMessages,
                    userId: user?.id // Pass User ID for context
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();

            // Format the display content from JSON
            // If data.speech exists, it's the new format. Otherwise fallback.
            let displayContent = data.content;
            if (data.speech) {
                displayContent = `${data.speech}\n\n**ROI Insight:** \`${data.roi_stat}\``;
            }

            // Start Typing Effect
            simulateTypingEffect(displayContent);

            // Save to Supabase (Only if logged in)
            if (user) {
                await supabase.from('chat_history').insert([
                    { student_id: user.id, role: 'user', content: userMsg.content },
                    { student_id: user.id, role: 'assistant', content: displayContent }
                ]);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the consultant server. Please try again." }]);
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
            "flex bg-white overflow-hidden border border-slate-100 mx-auto transition-all duration-300",
            isWidget ? "h-full w-full rounded-2xl shadow-none border-0" : "h-[85vh] w-full max-w-[95%] rounded-2xl shadow-2xl border-slate-200"
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
                <div className="w-80 bg-slate-50 border-r border-slate-200 p-6 hidden md:flex flex-col">
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp size={14} /> Career Trajectory
                        </h3>
                        <div className="relative pt-2">
                            <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    initial={{ width: "10%" }}
                                    animate={{ width: `${trajectory}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
                                <span>Analysis</span>
                                <span>Ready</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History size={14} /> Recent Intel
                        </h3>
                        <div className="space-y-2">
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm cursor-pointer hover:border-blue-400 transition-colors">
                                <span className="font-bold block text-slate-800">Engineering ROI</span>
                                <span className="text-xs text-slate-400">2 hours ago</span>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm cursor-pointer hover:border-blue-400 transition-colors">
                                <span className="font-bold block text-slate-800">Visa Requirements</span>
                                <span className="text-xs text-slate-400">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/30 relative">

                {/* Header */}
                <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-lg">Orbis Intelligence</h2>
                            <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                Online
                            </p>
                        </div>
                    </div>
                    {isWidget && onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                            <X size={20} />
                        </Button>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={scrollRef}>

                    {/* Welcome Message */}
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 text-slate-700 px-6 py-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                            <p className="mb-2 font-semibold text-lg">Hello! I'm Orbis.</p>
                            <p className="text-base leading-relaxed">I specialize in engineering career paths and ROI analysis. Whether you're in 10th grade or final year, I can help plan your next move using real-time data.</p>
                        </div>
                    </div>

                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[85%] px-6 py-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal"
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
                            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                <Sparkles size={16} className="text-blue-500 animate-spin" />
                                <span className="text-sm text-slate-500 italic">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex items-center gap-2 max-w-4xl mx-auto relative bg-slate-50 rounded-2xl border border-slate-200 px-2 py-2 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all shadow-sm hover:border-blue-300"
                    >
                        <div className="pl-3 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer">
                            <MessageSquare size={20} />
                        </div>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about ROI, Universities, or Career Paths..."
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-800 placeholder:text-slate-400 h-12 px-2 text-base font-medium"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsVoiceMode(true)}
                            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                            <Mic size={20} />
                        </Button>
                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-10 w-10 shadow-md transition-all hover:shadow-lg hover:scale-105",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={isLoading}
                        >
                            <Send size={18} className={isLoading ? "opacity-0" : "opacity-100"} />
                        </Button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase flex items-center justify-center gap-1">
                            <Sparkles size={10} className="text-blue-400" />
                            Orbis Intelligence Module v1.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
