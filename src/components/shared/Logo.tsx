"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
    const iconSizes = {
        sm: "h-6 w-6",
        md: "h-10 w-10",
        lg: "h-14 w-14"
    };

    const fontSizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl"
    };

    return (
        <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
            <div className={cn("relative flex items-center justify-center", iconSizes[size])}>
                {/* SVG Orbit System */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Ring 1 - Vertical-ish */}
                    <motion.ellipse
                        cx="50" cy="50" rx="45" ry="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-primary/30"
                        style={{ rotate: 45 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    {/* Dot on Ring 1 */}
                    <motion.circle
                        cx="50" cy="50" r="3"
                        fill="currentColor"
                        className="text-primary shadow-[0_0_10px_white]"
                        animate={{
                            cx: [50 + 45 * Math.cos(0), 50 + 45 * Math.cos(2 * Math.PI)],
                            cy: [50 + 15 * Math.sin(0), 50 + 15 * Math.sin(2 * Math.PI)],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px", rotate: 45 }}
                    />

                    {/* Ring 2 - Horizontal-ish */}
                    <motion.ellipse
                        cx="50" cy="50" rx="45" ry="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-purple-500/30"
                        style={{ rotate: -45 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                    {/* Dot on Ring 2 */}
                    <motion.circle
                        cx="50" cy="50" r="3"
                        fill="currentColor"
                        className="text-purple-400"
                        animate={{
                            cx: [50 + 45 * Math.cos(0), 50 + 45 * Math.cos(2 * Math.PI)],
                            cy: [50 + 15 * Math.sin(0), 50 + 15 * Math.sin(2 * Math.PI)],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px", rotate: -45 }}
                    />

                    {/* Ring 3 - Flat */}
                    <motion.ellipse
                        cx="50" cy="50" rx="35" ry="35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-white/10"
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />

                    {/* Central Core */}
                    <circle cx="50" cy="50" r="12" fill="black" stroke="currentColor" strokeWidth="1" className="text-primary/50" />
                    <motion.circle
                        cx="50" cy="50" r="6"
                        fill="currentColor"
                        className="text-primary shadow-[0_0_20px_rgba(0,243,255,0.8)]"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>

                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span
                        className={cn(
                            "font-bold tracking-[0.2em] text-slate-900 dark:text-white transition-all group-hover:text-primary group-hover:tracking-[0.25em]",
                            fontSizes[size]
                        )}
                        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                        ORBIS
                    </span>
                    <motion.div
                        className="h-[1px] w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-30"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1 }}
                    />
                </div>
            )}
        </div>
    );
}
