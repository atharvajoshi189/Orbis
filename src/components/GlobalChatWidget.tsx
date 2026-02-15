"use client";

import { useState, useEffect, useRef } from "react";
import { OrbisChat } from "@/components/OrbisChat";
import Robot3D from "@/components/Robot3D";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showFallback, setShowFallback] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const [greetingText, setGreetingText] = useState("Hi! 👋");

    const isOpenRef = useRef(isOpen);
    useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

    const GREETINGS = [
        "Hi! 👋",
        "Click here! 🖱️",
        "Ready to assist! 🤖",
        "Need help? ✨",
        "Ask away! 💡",
        "I'm listening 👂"
    ];

    // Random greeting logic
    useEffect(() => {
        let timeoutToShow: NodeJS.Timeout;
        let timeoutToHide: NodeJS.Timeout;

        const triggerGreeting = () => {
            if (isOpenRef.current) {
                // If chat is open, try again in 10s
                timeoutToShow = setTimeout(triggerGreeting, 10000);
                return;
            }

            // Pick random greeting
            const randomMsg = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
            setGreetingText(randomMsg);

            // Show greeting
            setShowGreeting(true);

            // Hide after 4 seconds
            timeoutToHide = setTimeout(() => {
                setShowGreeting(false);

                // Schedule next greeting (random time between 15s and 45s)
                const nextDelay = Math.random() * 30000 + 15000;
                timeoutToShow = setTimeout(triggerGreeting, nextDelay);
            }, 4000);
        };

        // Initial start delay
        timeoutToShow = setTimeout(triggerGreeting, 5000);

        return () => {
            clearTimeout(timeoutToShow);
            clearTimeout(timeoutToHide);
        };
    }, []);

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

            {/* Robot Greeting Bubble */}
            <AnimatePresence>
                {!isOpen && showGreeting && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute right-24 bottom-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-2xl rounded-br-none shadow-xl border border-slate-800 dark:border-slate-200 whitespace-nowrap z-40 pointer-events-none"
                    >
                        <p className="text-sm font-medium">{greetingText}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowGreeting(false); // Hide greeting when clicked
                }}
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
