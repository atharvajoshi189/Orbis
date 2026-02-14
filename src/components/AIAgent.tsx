"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, Send, X, Sparkles } from "lucide-react";

export default function AIAgent() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.6)] z-50 ${isOpen ? "hidden" : "flex"}`}
            >
                <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20" />
                <MessageSquare className="w-8 h-8 text-black fill-current" />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-8 right-8 w-[400px] h-[600px] glass-panel rounded-3xl flex flex-col overflow-hidden shadow-2xl z-50 border border-neon-cyan/30"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-neon-cyan/20 to-blue-600/20 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black border border-neon-cyan flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-neon-cyan/20 animate-pulse" />
                                    <Sparkles className="w-5 h-5 text-neon-cyan relative z-10" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Orbis Grok</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-neon-cyan">Online & Thinking</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {/* AI Message */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-black border border-neon-cyan/50 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                                </div>
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none text-sm text-gray-200">
                                    Hello Atharva! I noticed you have a deadline for your SOP in 2 days. Would you like me to review your current draft or generate an outline?
                                </div>
                            </div>

                            {/* User Message */}
                            <div className="flex gap-3 justify-end">
                                <div className="bg-neon-cyan/10 border border-neon-cyan/20 p-3 rounded-2xl rounded-tr-none text-sm text-white">
                                    Can you help me structure the introduction?
                                </div>
                            </div>

                            {/* AI Thinking Placeholder */}
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-black border border-neon-cyan/50 flex-shrink-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                                </div>
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/40 border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ask Orbis..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-24 text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button className="p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded-full transition-colors">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-neon-cyan text-black rounded-full hover:bg-neon-cyan/80 transition-colors shadow-[0_0_10px_rgba(0,245,255,0.5)]">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
