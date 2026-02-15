"use client";

import Navbar from "@/components/Navbar";
import { TrendingUp, Compass, ArrowRight, Activity, Zap, Shield, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Suspense, useEffect, useState } from "react";
import { DashboardToast } from "@/components/DashboardToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { supabase } from "@/utils/supabase/client";
import { SkillGapWidget } from "@/components/dashboard/SkillGapWidget";
import { DeadlinesWidget } from "@/components/dashboard/DeadlinesWidget";
import { DailyIntelWidget } from "@/components/dashboard/DailyIntelWidget";
import { AIConfidenceWidget } from "@/components/dashboard/AIConfidenceWidget";
import { ReverseROIWidget } from "@/components/dashboard/ReverseROIWidget";
import { Badge } from "@/components/ui/badge";

import { MissionWidget } from "@/components/dashboard/MissionWidget";

interface GrokDashboardData {
    confidence_score: number;
    human_review_needed: boolean;
    skill_gaps: any[];
    deadlines: any[];
    daily_intel: any;
    radar_analysis: any[];
}

export default function DashboardPage() {
    const { user } = useAppStore();
    const [profileData, setProfileData] = useState<any>(null);
    const [grokData, setGrokData] = useState<GrokDashboardData | null>(null);
    const [roadmap, setRoadmap] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProfile = async () => {
        if (!user) return null;
        const { data: profile } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .single();
        if (profile) setProfileData(profile);
        return profile;
    };

    const fetchRoadmap = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('active_roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();
        if (data) setRoadmap(data);
    };

    useEffect(() => {
        const initDashboard = async () => {
            if (!user) return;
            console.log("Initializing Dashboard...");

            const profile = await fetchProfile();

            if (profile) {
                // Fetch Grok Insights
                setIsLoading(true);
                try {
                    const res = await fetch('/api/grok-dashboard', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profile })
                    });

                    if (res.ok) {
                        const insights = await res.json();
                        setGrokData(insights);
                    }
                } catch (err) {
                    console.error("API Error", err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initDashboard();
    }, [user]);

    // Use Grok radar data if available, otherwise fallback
    const statsData = grokData?.radar_analysis || [
        { subject: 'CGPA', A: profileData?.gpa ? parseFloat(profileData.gpa) * 12 : 100, fullMark: 150 },
        { subject: 'Skills', A: (profileData?.skills?.length || 0) * 20 + 50, fullMark: 150 },
        { subject: 'Exp', A: 86, fullMark: 150 },
        { subject: 'Extra', A: (profileData?.interests?.length || 0) * 20 + 50, fullMark: 150 },
        { subject: 'Logic', A: 85, fullMark: 150 },
        { subject: 'Comm', A: 90, fullMark: 150 },
    ];

    return (
        <div className="min-h-screen font-sans transition-colors duration-300">
            <Navbar />
            <Suspense fallback={null}>
                <DashboardToast />
            </Suspense>

            <div className="container-custom mx-auto py-24 px-4 space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Command Center
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            Welcome back, <span className="text-cyan-500 font-bold">{user?.name}</span>.
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2 ml-2 text-xs uppercase tracking-widest text-cyan-400 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Analyzing Profile...
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 ml-2 text-xs uppercase tracking-widest text-green-400">
                                    Systems Nominal
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="bg-black/5 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                            v2.5.0 AI
                        </Badge>
                    </div>
                </div>

                {/* 1. Mission & Confidence Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <AIConfidenceWidget
                            confidence={grokData?.confidence_score || 0}
                            reviewNeeded={grokData?.human_review_needed || false}
                        />
                        {/* Mission Widget integrated here in the sidebar column for better layout */}
                        <MissionWidget
                            xp={profileData?.xp || 0}
                            level={profileData?.level || 1}
                            completedMissions={profileData?.completed_missions || []}
                            activeRoadmap={roadmap}
                            onUpdate={() => { fetchProfile(); fetchRoadmap(); }}
                        />
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DailyIntelWidget data={grokData?.daily_intel} />
                        <DeadlinesWidget data={grokData?.deadlines} />
                        <SkillGapWidget data={grokData?.skill_gaps} />
                    </div>
                </div>

                {/* 2. Main Analysis Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Radar Chart (Migrated) */}
                    <Card className="lg:col-span-2 bg-white/80 dark:bg-black/40 border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase text-slate-800 dark:text-white">
                                <Activity className="text-cyan-500 w-5 h-5" /> Attribute Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="h-[300px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsData}>
                                            <PolarGrid stroke="#94a3b830" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                            <Radar
                                                name={user?.name || "Operative"}
                                                dataKey="A"
                                                stroke="#06b6d4"
                                                strokeWidth={2}
                                                fill="#06b6d4"
                                                fillOpacity={0.2}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                            <div className="text-2xl font-black text-slate-800 dark:text-white">
                                                {profileData?.gpa || "N/A"}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current CGPA</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                            <div className="text-2xl font-black text-slate-800 dark:text-white">
                                                {statsData[1].A > 100 ? "High" : "Mid"}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skill Level</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Core Strengths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData?.strengths?.map((s: string, i: number) => (
                                                <Badge key={i} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">{s}</Badge>
                                            )) || <span className="text-slate-500 text-xs italic">No strengths logged.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Actions / ROI */}
                    <div className="space-y-6">
                        <Link href="/roi">
                            <ReverseROIWidget />
                        </Link>

                        <Link href="/guidance">
                            <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-8 transition-all hover:border-cyan-500/50">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Compass className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Guidance</h2>
                                    <p className="text-slate-500 mb-8 max-w-[200px]">
                                        AI-powered career strategy and pathfinding.
                                    </p>
                                    <div className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white group-hover:gap-4 transition-all">
                                        Launch System <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
