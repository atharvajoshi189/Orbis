"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface DeadlinesWidgetProps {
    data?: { title: string; date: string; time: string; urgent: boolean }[];
}

export function DeadlinesWidget({ data }: DeadlinesWidgetProps) {
    const deadlines = data || [
        { title: "GRE Mock Test 3", date: "Today", time: "8:00 PM", urgent: true },
        { title: "University A App", date: "Feb 20", time: "11:59 PM", urgent: false },
        { title: "Internship Report", date: "Feb 25", time: "5:00 PM", urgent: false },
    ];

    return (
        <Card className="bg-black/20 border-white/10 backdrop-blur-md h-full">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase text-white tracking-wider">
                    <Calendar className="text-purple-400 w-4 h-4" /> Upcoming Deadlines
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {deadlines.map((item, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${item.urgent ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                        <div className={`p-2 rounded-md ${item.urgent ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-slate-400'}`}>
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${item.urgent ? 'text-red-300' : 'text-slate-200'}`}>{item.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                                <span>{item.date}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
