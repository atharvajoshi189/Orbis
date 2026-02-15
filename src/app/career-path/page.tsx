"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Search, Target, TrendingUp, Trophy, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CareerPathPage() {
    const { user } = useAppStore();
    const router = useRouter();

    const [step, setStep] = useState<'verify' | 'loading' | 'selection'>('verify');
    const [profile, setProfile] = useState<any>(null);
    const [roadmaps, setRoadmaps] = useState<any>(null);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const { data } = await supabase.from('students').select('*').eq('user_id', user.id).single();
            if (data) setProfile(data);
        };
        fetchProfile();
    }, [user]);

    const handleGenerate = async () => {
        setStep('loading');
        try {
            const res = await fetch('/api/career-roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.details || "Failed to generate");
            }

            const data = await res.json();
            setRoadmaps(data);
            setStep('selection');
        } catch (error: any) {
            console.error(error);
            toast.error(`AI Analysis Failed: ${error.message}`);
            setStep('verify');
        }
    };

    const handleSelectPath = async (key: string) => {
        setSelectedPath(key);
        setIsSaving(true);
        const roadmap = roadmaps[key];

        try {
            const { error } = await supabase.from('active_roadmaps').insert({
                user_id: user?.id,
                title: roadmap.title,
                type: key,
                milestones: roadmap.milestones,
                current_step: 0,
                is_active: true
            });

            if (error) throw error;

            toast.success("Journey Activated! Redirecting to Dashboard...");
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Failed to save roadmap");
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-300">
            <Navbar />

            <div className="container-custom mx-auto py-24 px-4 min-h-[80vh] flex flex-col justify-center">

                <AnimatePresence mode="wait">
                    {/* STEP 1: VERIFY PROFILE */}
                    {step === 'verify' && profile && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                                    Career Engine <span className="text-cyan-500">Initialization</span>
                                </h1>
                                <p className="text-slate-500">Confirm your data to generate optimized Trajectories.</p>
                            </div>

                            <Card className="bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 backdrop-blur-xl p-6">
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-xl">
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Current GPA</div>
                                        <div className="text-3xl font-black text-slate-800 dark:text-white">{profile.gpa || "N/A"}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-xl">
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Target</div>
                                        <div className="text-xl font-bold text-slate-800 dark:text-white">{profile.career_goal || "Not Set"}</div>
                                    </div>
                                    <div className="col-span-2 p-4 bg-slate-50 dark:bg-black/40 rounded-xl">
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Key Skills</div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {profile.skills?.map((s: string) => (
                                                <span key={s} className="px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs rounded border border-cyan-500/20">
                                                    {s}
                                                </span>
                                            )) || "No skills logged"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1" onClick={() => router.push('/profile')}>
                                        Update Profile
                                    </Button>
                                    <Button className="flex-[2] bg-cyan-500 hover:bg-cyan-600 text-white gap-2" onClick={handleGenerate}>
                                        <Zap className="fill-current" size={16} /> Confirm & Analyze
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 2: LOADING */}
                    {step === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-64"
                        >
                            <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6" />
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Calculating Trajectories...</h2>
                            <p className="text-slate-500 mt-2">Consulting Llama-3.3 Database</p>
                        </motion.div>
                    )}

                    {/* STEP 3: SELECTION */}
                    {step === 'selection' && roadmaps && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    Select Your <span className="text-cyan-500">Timeline</span>
                                </h1>
                                <p className="text-slate-500">Three personalized paths to your goal.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* FAST TRACK */}
                                <RoadmapCard
                                    type="fast_track"
                                    data={roadmaps.fast_track}
                                    icon={Zap}
                                    color="text-yellow-400"
                                    bg="from-yellow-500/10 to-transparent"
                                    onClick={() => handleSelectPath('fast_track')}
                                    loading={isSaving && selectedPath === 'fast_track'}
                                />
                                {/* GROWTH */}
                                <RoadmapCard
                                    type="growth"
                                    data={roadmaps.growth}
                                    icon={TrendingUp}
                                    color="text-cyan-400"
                                    bg="from-cyan-500/10 to-transparent"
                                    onClick={() => handleSelectPath('growth')}
                                    loading={isSaving && selectedPath === 'growth'}
                                    recommended
                                />
                                {/* MASTERY */}
                                <RoadmapCard
                                    type="mastery"
                                    data={roadmaps.mastery}
                                    icon={Trophy}
                                    color="text-purple-400"
                                    bg="from-purple-500/10 to-transparent"
                                    onClick={() => handleSelectPath('mastery')}
                                    loading={isSaving && selectedPath === 'mastery'}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

function RoadmapCard({ type, data, icon: Icon, color, bg, onClick, loading, recommended }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative p-6 rounded-3xl border ${recommended ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(8,145,178,0.2)]' : 'border-slate-200 dark:border-white/10'} bg-white dark:bg-slate-900 overflow-hidden cursor-pointer group`}
            onClick={onClick}
        >
            {recommended && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                    Recommended
                </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-b ${bg} opacity-20`} />

            <div className="relative z-10">
                <Icon className={`w-10 h-10 ${color} mb-4`} />
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{data.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold mt-1 mb-4">
                    <Clock size={14} /> {data.duration}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">
                    {data.description}
                </p>

                <div className="space-y-3 mb-8">
                    {data.milestones.slice(0, 3).map((m: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                            <CheckCircle size={12} className={color} /> {m.task}
                        </div>
                    ))}
                    {data.milestones.length > 3 && (
                        <div className="text-xs text-slate-400 pl-5">+ {data.milestones.length - 3} more milestones</div>
                    )}
                </div>

                <Button className={`w-full ${recommended ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white'} font-bold`}>
                    {loading ? <Loader2 className="animate-spin" /> : "Select Path"}
                </Button>
            </div>
        </motion.div>
    )
}
