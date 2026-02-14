"use client";

import WorldMap from "@/components/WorldMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, TrendingUp, Zap, Map } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalTrendsPage() {
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

                {/* 3D Globe Viewport */}
                <div className="lg:col-span-3 relative h-full w-full bg-slate-950 flex items-center justify-center p-8">
                    <WorldMap />

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
