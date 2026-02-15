"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    type?: "success" | "error";
    duration?: number;
    onClose?: () => void;
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn(
                        "fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border",
                        type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}
                >
                    {type === "success" ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <X className="w-5 h-5" />
                    )}
                    <span className="font-semibold text-sm">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
