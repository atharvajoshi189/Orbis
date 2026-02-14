"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrbisChat } from "@/components/OrbisChat";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <OrbisChat isWidget={true} onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
            >
                <MessageSquare size={32} />
            </Button>
        </>
    );
}
