"use client";

import { motion } from "framer-motion";

interface ProfileCardProps {
    name: string;
    year: string;
    targetCountry: string;
    readinessScore: number;
}

export default function ProfileCard({
    name,
    year,
    targetCountry,
    readinessScore,
}: ProfileCardProps) {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="orbis-card p-6 rounded-2xl w-full max-w-sm relative overflow-hidden group border-t-2 border-t-white/10"
        >
            {/* Sci-Fi Grid Background */}
            <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h2 className="text-xl font-bold font-mono text-white mb-1 tracking-wide">{name.toUpperCase()}</h2>
                    <p className="text-xs text-neon-cyan font-mono tracking-wider">{year.toUpperCase()}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold font-mono tracking-widest uppercase">
                        TARGET: {targetCountry}
                    </div>
                </div>

                <div className="relative flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="transform -rotate-90 w-24 h-24" viewBox="0 0 96 96">
                        <circle
                            className="text-white/5"
                            strokeWidth="6"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                        />
                        <circle
                            className="text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,255,0.5)] transition-all duration-1000 ease-out"
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-bold font-mono text-white">{readinessScore}%</span>
                        <span className="text-[8px] text-gray-400 font-mono tracking-widest">READY</span>
                    </div>
                </div>
            </div>

            {/* Decorative Bottom Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-50" />
        </motion.div>
    );
}
