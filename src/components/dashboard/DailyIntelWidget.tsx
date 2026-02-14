"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ExternalLink } from "lucide-react";

interface DailyIntelWidgetProps {
    data?: { title: string; content: string };
}

export function DailyIntelWidget({ data }: DailyIntelWidgetProps) {
    const intel = data || {
        title: "AI in Cybersecurity is predicted to grow by 40% in 2026.",
        content: "Focusing your next project on LLM-based anomaly detection could significantly boost your profile for top-tier tech firms."
    };

    return (
        <Card className="bg-gradient-to-br from-indigo-900/30 to-black/40 border-indigo-500/30 backdrop-blur-md h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />

            <CardHeader className="border-b border-indigo-500/20 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase text-indigo-300 tracking-wider">
                    <Lightbulb className="text-yellow-400 w-4 h-4" /> Daily Intel
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    "{intel.title}"
                </h3>
                <p className="text-xs text-indigo-200/60 leading-relaxed mb-4">
                    {intel.content}
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors">
                    Read Briefing <ExternalLink className="w-3 h-3" />
                </button>
            </CardContent>
        </Card>
    );
}
