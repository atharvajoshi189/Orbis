"use client";

import WorldMap from "@/components/WorldMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, TrendingUp, Zap, Map, Sliders, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function GlobalTrendsPage() {
    const [cgpa, setCgpa] = useState<number>(0); // 0 means no filter
    const [simulateLoan, setSimulateLoan] = useState<boolean>(false);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none z-0" />

            {/* Header / Nav */}
            <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Globe size={20} className="text-blue-500" />
                            Global Trends Intelligence
                        </h1>
                        <span className="text-xs text-slate-500 font-mono">LIVE DATAFEED /// CONNECTED</span>
                    </div>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                        <Zap size={12} />
                        <span>AI Analysis Active</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-80px)]">

                <div className="lg:col-span-3 relative h-full w-full bg-slate-950 flex items-center justify-center p-8 overflow-hidden">
                    <WorldMap cgpaFilter={cgpa > 0 ? cgpa : undefined} selectedLoanProvider={simulateLoan ? "SBI Global" : undefined} />

                    {/* Overlay Stats (Optional) */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md w-64"
                        >
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Destination</h3>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-bold text-white">Germany</span>
                                <span className="text-green-400 text-sm font-mono">+24% Interest</span>
                            </div>
                            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-blue-500 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                    {/* Control Panel Overlay */}
                    <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
                        <motion.div
                            className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-xl w-72 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <Sliders size={14} /> Intelligence Filters
                            </h3>

                            {/* CGPA Slider */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">Min CGPA Requirement</span>
                                    <span className="text-white font-mono">{cgpa > 0 ? cgpa : "Any"}</span>
                                </div>
                                <input
                                    type="range"
                                    min="6" max="10" step="0.1"
                                    value={cgpa || 6}
                                    onChange={(e) => setCgpa(parseFloat(e.target.value))}
                                    className="w-full accent-cyan-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Loan Simulation Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-2">
                                    <DollarSign size={14} className="text-emerald-400" /> Simulate Loan Flow
                                </span>
                                <button
                                    onClick={() => setSimulateLoan(!simulateLoan)}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${simulateLoan ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${simulateLoan ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Sidebar Info Panel */}
                <div className="hidden lg:flex flex-col border-l border-white/5 bg-slate-900/40 p-6 overflow-y-auto">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <TrendingUp size={16} /> Regional Insights
                    </h2>

                    <div className="space-y-4">
                        <InsightCard
                            title="North America"
                            status="High Competition"
                            desc="Tech job market stabilizing. Visa caps reached for Q1."
                            color="text-orange-400"
                        />
                        <InsightCard
                            title="Europe (DACH)"
                            status="Opportunity"
                            desc="Germany & Austria easing immigration for skilled engineers."
                            color="text-green-400"
                        />
                        <InsightCard
                            title="Asia Pacific"
                            status="Growing"
                            desc="Japan offering fast-track visas for robotics specialists."
                            color="text-blue-400"
                        />
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5 text-xs text-slate-600">
                        <p>Data refreshed: 14 mins ago</p>
                        <p>Source: Orbis Network Nodes</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InsightCard({ title, status, desc, color }: { title: string, status: string, desc: string, color: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{title}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${color} bg-white/5 px-2 py-0.5 rounded`}>{status}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    )
}
