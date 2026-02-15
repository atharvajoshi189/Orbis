"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { ACCURATE_WORLD_MAP } from "./world-map-data";
import { COUNTRY_COORDINATES, GLOBAL_TRENDS } from "./world-map-coordinates";
import scholarshipsData from "@/data/scholarships.json";

// Types
interface WorldMapProps {
    onPinClick?: (location: any) => void;
    cgpaFilter?: number; // e.g., 7.5
    selectedLoanProvider?: string; // e.g., "SBI" to trigger animations
}

export default function WorldMap({ onPinClick, cgpaFilter, selectedLoanProvider }: WorldMapProps) {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [audioAllowed, setAudioAllowed] = useState(false);

    // 1. Process Scholarship Data to find Active Nodes
    const activeNodes = useMemo(() => {
        const nodes: Record<string, { count: number, minCgpa: number, scholarships: any[] }> = {};

        scholarshipsData.forEach(sch => {
            const country = sch.country;
            if (COUNTRY_COORDINATES[country]) {
                if (!nodes[country]) {
                    nodes[country] = { count: 0, minCgpa: 100, scholarships: [] };
                }
                nodes[country].count++;
                nodes[country].scholarships.push(sch);
                // Normalize criteria.min_marks (assuming % to 10 scale if > 10, else as is)
                let marks = sch.criteria?.min_marks || 0;
                if (marks > 10) marks = marks / 10; // Convert 70% to 7.0
                nodes[country].minCgpa = Math.min(nodes[country].minCgpa, marks);
            }
        });
        return nodes;
    }, []);

    // 2. Audio Narration Logic (Aoide Persona)
    const speakTrend = (countryName: string) => {
        if (!audioAllowed) return;
        window.speechSynthesis.cancel(); // Stop overlap

        const trend = GLOBAL_TRENDS[countryName] || `Explore opportunities in ${countryName}.`;
        const utterance = new SpeechSynthesisUtterance(trend);

        // Try to find a female voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google US English"));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    // Enable audio on first interaction
    useEffect(() => {
        const enableAudio = () => setAudioAllowed(true);
        window.addEventListener('click', enableAudio);
        return () => window.removeEventListener('click', enableAudio);
    }, []);

    return (
        <div className="relative w-full aspect-[1.8/1] bg-[#050510] rounded-xl overflow-hidden shadow-2xl border border-cyan-900/30 group">

            {/* Holographic Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Scaning Line Animation */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10%] w-full animate-scan pointer-events-none opacity-30" />

            {/* MAIN SVG MAP */}
            <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center">
                <svg viewBox="0 0 1009 650" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <defs>
                        {/* Hexagonal Grid Pattern */}
                        <pattern id="hex-grid" x="0" y="0" width="10" height="17.32" patternUnits="userSpaceOnUse">
                            <path d="M5 0L10 2.89V8.66L5 11.55L0 8.66V2.89L5 0Z" fill="none" stroke="rgba(6,182,212, 0.4)" strokeWidth="0.5" />
                        </pattern>

                        {/* Dot Matrix Pattern (Alternative High-Res) */}
                        <pattern id="dot-matrix" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" className="fill-cyan-500/60" />
                        </pattern>

                        {/* Glow Filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Loan Flow Gradient */}
                        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Continents Masked with Pattern */}
                    <g className="opacity-90 mix-blend-screen">
                        {ACCURATE_WORLD_MAP.map((path, i) => (
                            <path
                                key={i}
                                d={path.d}
                                fill="url(#dot-matrix)"
                                stroke="rgba(34, 211, 238, 0.3)"
                                strokeWidth="0.5"
                                className="transition-all duration-500 hover:fill-cyan-400/80 hover:filter hover:url(#glow)"
                            />
                        ))}
                    </g>
                </svg>
            </div>

            {/* INTERACTIVE LAYER (HTML Overlay for better accessibility/z-index) */}
            <div className="absolute inset-0 pointer-events-none">
                {Object.entries(COUNTRY_COORDINATES).map(([name, coords]) => {
                    const data = activeNodes[name];
                    if (!data) return null;

                    // Filter Logic
                    const isDimmed = cgpaFilter ? data.minCgpa > cgpaFilter : false;
                    const isHovered = hoveredCountry === name;

                    return (
                        <div
                            key={name}
                            className={`absolute transition-all duration-500 pointer-events-auto ${isDimmed ? 'opacity-20 grayscale' : 'opacity-100'}`}
                            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                            onMouseEnter={() => {
                                setHoveredCountry(name);
                                speakTrend(name);
                            }}
                            onMouseLeave={() => setHoveredCountry(null)}
                            onClick={() => onPinClick?.({ name, ...data })}
                        >
                            <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer">

                                {/* Pulse Ring */}
                                <div className={`absolute rounded-full border border-cyan-400/50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] ${isHovered ? 'w-16 h-16 bg-cyan-500/10' : 'w-8 h-8'}`} />

                                {/* Core Node */}
                                <div className={`relative rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] bg-cyan-400 border-2 border-white ${isHovered ? 'w-4 h-4 scale-125' : 'w-2 h-2'}`} />

                                {/* Floating Label (Holographic Effect) */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-500/50 p-3 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md min-w-[200px] z-50 text-left"
                                        >
                                            <div className="flex items-center justify-between mb-1 border-b border-cyan-500/30 pb-1">
                                                <span className="text-cyan-300 font-bold text-xs uppercase tracking-wider">{name}</span>
                                                <span className="text-[10px] text-cyan-400 bg-cyan-900/30 px-1 rounded">{data.count} Opps</span>
                                            </div>
                                            <div className="text-[10px] text-slate-300 leading-tight">
                                                {GLOBAL_TRENDS[name] || "High potential for engineering & tech roles."}
                                            </div>
                                            {data.minCgpa > 0 && (
                                                <div className="mt-2 text-[9px] text-emerald-400 font-mono">
                                                    Min CGPA ~ {data.minCgpa * 10}% / {data.minCgpa.toFixed(1)}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}

                {/* Data Pipelines (Loan Flow Animation) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {selectedLoanProvider && Object.entries(COUNTRY_COORDINATES).map(([name, coords]) => {
                        // Only draw lines to active nodes
                        if (!activeNodes[name]) return null;
                        if (name === "India") return null; // Source

                        const start = COUNTRY_COORDINATES["India"];

                        return (
                            <motion.line
                                key={`line-${name}`}
                                x1={`${start.x}%`}
                                y1={`${start.y}%`}
                                x2={`${coords.x}%`}
                                y2={`${coords.y}%`}
                                stroke="url(#flow-gradient)"
                                strokeWidth="1.5"
                                strokeDasharray="5 5"
                                initial={{ strokeDashoffset: 100, opacity: 0 }}
                                animate={{ strokeDashoffset: 0, opacity: 0.6 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* UI Overlay: Legend */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none">
                <div className="bg-black/80 backdrop-blur border border-cyan-900/50 p-3 rounded-lg text-[10px] text-cyan-100/70 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]"></span>
                        <span>High ROI Zone</span>
                    </div>
                    {cgpaFilter && (
                        <div className="flex items-center gap-2 text-yellow-500">
                            <span className="w-2 h-2 rounded-full bg-slate-700 border border-slate-500"></span>
                            <span>Low Entry Probability</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
