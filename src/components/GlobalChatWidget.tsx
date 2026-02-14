"use client";

import { useState } from "react";
import { OrbisChat } from "@/components/OrbisChat";
import Robot3D from "@/components/Robot3D";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[400px] h-[600px] max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950"
                    >
                        <OrbisChat isWidget={true} onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={`h-24 w-24 rounded-full shadow-none hover:bg-transparent transition-all duration-300 ${isOpen
                    ? "bg-transparent"
                    : "bg-transparent hover:scale-110"
                    }`}
            >
                {isOpen ? (
                    <div className="bg-slate-900 p-3 rounded-full shadow-lg border border-slate-800">
                        <X size={24} className="text-slate-400" />
                    </div>
                ) : (
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="flex items-center justify-center w-full h-full relative"
                    >

                        {/* Robot Image with Glow */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse z-0" />

                        <div className="w-20 h-20 z-10 relative">
                            <Robot3D />
                        </div>

                    </motion.div>
                )}
            </Button>
        </div>
    );
}
