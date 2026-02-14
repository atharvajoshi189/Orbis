"use client";

import { useState } from "react";
import { OrbisChat } from "@/components/OrbisChat";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[400px] h-[600px] max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white"
                    >
                        <OrbisChat isWidget={true} onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${isOpen
                        ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-110 hover:shadow-blue-500/50"
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </Button>
        </div>
    );
}
