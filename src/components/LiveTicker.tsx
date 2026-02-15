"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Globe } from "lucide-react";
import Translate from "./Translate";

const tickerData = [
    // ...
    { label: "US Tech Visa Cap", value: "85,000", change: "+2%", trend: "up" },
    { label: "Germany skilled worker demand", value: "High", change: "+15%", trend: "up" },
    { label: "Avg DS Salary (Remote)", value: "$115k", change: "+5.4%", trend: "up" },
    { label: "UK Post-Study Work", value: "Active", change: "Stable", trend: "neutral" },
    { label: "Canada PR Score Cutoff", value: "485", change: "-5", trend: "down" },
    { label: "Aus Student Visa Turnaround", value: "18 Days", change: "-2 Days", trend: "down" },
];

export default function LiveTicker() {
    return (
        <div className="w-full bg-slate-900/50 border-y border-white/5 backdrop-blur-md overflow-hidden py-3 flex items-center">
            <div className="container-custom flex items-center">
                <div className="flex items-center gap-2 px-4 border-r border-white/10 shrink-0">
                    <div className="relative">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-xs font-bold text-red-400 tracking-wider uppercase"><Translate text="Live Market Data" /></span>
                </div>

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-12 pl-12 whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...tickerData, ...tickerData].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-300"><Translate text={item.label} /></span>
                                <span className="text-sm font-bold text-white">{item.value}</span>
                                <span className={`text-xs flex items-center ${item.trend === 'up' ? 'text-green-400' :
                                    item.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                                    }`}>
                                    {item.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                                    {item.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
