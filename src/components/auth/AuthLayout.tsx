"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Logo } from "../shared/Logo";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300">
            {/* Glass Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group transition-colors">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <Logo size="md" />
                        </div>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 dark:from-blue-400 to-purple-600 dark:to-purple-400 mb-2">
                                {title}
                            </h1>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{subtitle}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
