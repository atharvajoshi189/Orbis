"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface SkillGapWidgetProps {
    data?: { name: string; you: number; market: number }[];
}

export function SkillGapWidget({ data }: SkillGapWidgetProps) {
    // Fallback data if API fails or is loading
    const skills = data || [
        { name: "React", you: 85, market: 90 },
        { name: "Node.js", you: 70, market: 85 },
        { name: "Python", you: 60, market: 75 },
        { name: "Data Structures", you: 80, market: 70 },
    ];

    return (
        <Card className="bg-black/20 border-white/10 backdrop-blur-md h-full">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase text-white tracking-wider">
                    <TrendingUp className="text-cyan-400 w-4 h-4" /> Skill Gap Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>{skill.name}</span>
                            <span className="text-white">Gap: {skill.market - skill.you}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                            {/* Market Value Marker */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white/20 z-10"
                                style={{ left: `${skill.market}%` }}
                            />
                            {/* User Value Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.you}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full relative ${skill.you >= skill.market ? 'bg-green-400' : 'bg-orange-400'}`}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
