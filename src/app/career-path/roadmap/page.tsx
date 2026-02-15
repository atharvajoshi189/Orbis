"use client";

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Lock, Play, BookOpen, ExternalLink, Award, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';

type Milestone = {
    day: number;
    title: string;
    task: string;
    xp: number;
    status: 'pending' | 'completed' | 'active';
    milestone_type: 'Learning' | 'Project' | 'Quiz';
    subtopics?: string[];
    resources?: { title: string; url: string }[];
};

type ActiveRoadmap = {
    id: string;
    career_path: string;
    roadmap_type: string;
    milestones: Milestone[];
    current_day: number;
    total_xp: number;
};

export default function RoadmapPage() {
    const { user } = useAppStore();
    const router = useRouter();
    const [roadmap, setRoadmap] = useState<ActiveRoadmap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<Milestone | null>(null);


    useEffect(() => {
        const fetchRoadmap = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('active_roadmaps')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error || !data) {
                toast.error("No active protocol found. Redirecting...");
                router.push('/career-path');
                return;
            }

            // Transform milestones to add status based on current_day
            const enrichedMilestones = data.milestones.map((m: Milestone) => ({
                ...m,
                status: m.day < data.current_day ? 'completed'
                    : m.day === data.current_day ? 'active'
                        : 'pending'
            }));

            setRoadmap({ ...data, milestones: enrichedMilestones });
            setIsLoading(false);
        };
        fetchRoadmap();
    }, [user, router]);

    const handleComplete = async () => {
        if (!selectedNode || !roadmap || !user) return;

        // Capture values for async operations
        const currentNode = selectedNode;
        const currentRoadmapId = roadmap.id;
        const nextDay = roadmap.current_day + 1;

        // 1. Optimistic UI Update: Update local state immediately
        const updatedMilestones = roadmap.milestones.map(m => {
            if (m.day === currentNode.day) return { ...m, status: 'completed' } as Milestone;
            if (m.day === nextDay) return { ...m, status: 'active' } as Milestone;
            return m;
        });

        setRoadmap({ ...roadmap, current_day: nextDay, milestones: updatedMilestones });
        setSelectedNode(null); // Close modal immediately
        toast.success(`Mission Complete! +${currentNode.xp} XP`);

        // 2. Background Server Updates
        try {
            // Update Profile XP
            const { data: profile } = await supabase.from('students').select('xp, level').eq('user_id', user.id).single();
            const currentXP = profile?.xp || 0;
            const currentLevel = profile?.level || 1;

            const newXP = currentXP + currentNode.xp;
            const newLevel = Math.floor(newXP / 1000) + 1;
            const leveledUp = newLevel > currentLevel;

            await supabase.from('students').update({ xp: newXP, level: newLevel }).eq('user_id', user.id);

            // Update Roadmap
            await supabase.from('active_roadmaps').update({ current_day: nextDay }).eq('id', currentRoadmapId);

            // Delayed Level Up Notification
            if (leveledUp) {
                toast.success(`LEVEL UP! You are now Level ${newLevel}! 🏆`);
            }

        } catch (error) {
            console.error("Background update failed", error);
            toast.error("Sync warning: Progress saved locally but server sync failed. Please refresh.");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                <div className="text-cyan-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Command Map...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
            <Navbar />

            {/* Background Grid */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <main className="relative z-10 container-custom mx-auto pt-32 pb-20 px-4 min-h-screen flex flex-col">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Award className="w-3 h-3" /> Active Protocol: {roadmap?.roadmap_type.replace('_', ' ')}
                    </div>
                    <h1 className="text-5xl font-black font-outfit uppercase tracking-tighter mb-2">
                        {roadmap?.career_path} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Trajectory</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Mission Progress: Day {roadmap?.current_day} of {roadmap?.milestones.length}</p>
                </div>

                {/* SVG Path Map */}
                <div className="relative max-w-4xl mx-auto w-full flex-1">
                    {/* Central Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-800 -translate-x-1/2 rounded-full hidden md:block" />

                    <div className="space-y-24 relative">
                        {roadmap?.milestones.map((node, i) => (
                            <motion.div
                                key={node.day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row gap-8 md:gap-0`}
                            >
                                {/* Connection Line for Mobile */}
                                <div className="absolute left-6 top-8 bottom-[-6rem] w-1 bg-slate-800 md:hidden last:hidden" />

                                {/* Node Point */}
                                <div className="relative z-10 shrink-0 md:w-1/2 md:flex md:justify-end md:px-12 group">
                                    <button
                                        onClick={() => setSelectedNode(node)}
                                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative ${node.status === 'completed' ? 'bg-black border-green-500 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' :
                                            node.status === 'active' ? 'bg-black border-cyan-400 text-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.6)] scale-110 animate-pulse-slow' :
                                                'bg-slate-900 border-slate-700 text-slate-600 cursor-not-allowed hover:border-slate-600'
                                            }`}
                                    >
                                        {node.status === 'completed' ? <CheckCircle className="w-6 h-6 md:w-8 md:h-8" /> :
                                            node.status === 'active' ? <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" /> :
                                                <Lock className="w-5 h-5 md:w-6 md:h-6" />}

                                        {/* Day Label */}
                                        <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${node.status === 'active' ? 'text-cyan-400' : 'text-slate-600'
                                            }`}>Day {node.day}</div>
                                    </button>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 md:w-1/2 md:px-12">
                                    <div
                                        onClick={() => node.status !== 'pending' && setSelectedNode(node)}
                                        className={`p-6 rounded-3xl border transition-all cursor-pointer group/card ${node.status === 'active' ? 'bg-cyan-950/20 border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-950/30' :
                                            node.status === 'completed' ? 'bg-green-950/10 border-green-500/20 opacity-70 hover:opacity-100' :
                                                'bg-slate-900/50 border-slate-800 opacity-50 grayscale'
                                            }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${node.milestone_type === 'Project' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-blue-500/20 text-blue-400'
                                                }`}>{node.milestone_type}</span>
                                            <span className="text-xs font-bold text-slate-500">+{node.xp} XP</span>
                                        </div>
                                        <h3 className={`text-xl font-bold mb-1 ${node.status === 'active' ? 'text-white' : 'text-slate-300'
                                            }`}>{node.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 md:line-clamp-none">{node.task}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* MODAL DRAWER */}
                <AnimatePresence>
                    {selectedNode && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedNode(null)}
                                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-[#0A101F] border-l border-slate-800 p-8 shadow-2xl overflow-y-auto"
                            >
                                <button onClick={() => setSelectedNode(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${selectedNode.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                                            'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                            }`}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Day {selectedNode.day} Mission</div>
                                            <h2 className="text-2xl font-black text-white leading-tight">{selectedNode.title}</h2>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">{selectedNode.task}</p>

                                    {/* Subtopics */}
                                    {selectedNode.subtopics && selectedNode.subtopics.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-4">Key Objectives</h3>
                                            <div className="space-y-3">
                                                {selectedNode.subtopics.map((topic, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                        <span className="text-sm text-slate-300">{topic}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resources */}
                                    {selectedNode.resources && selectedNode.resources.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-4">Intel & Resources</h3>
                                            <div className="space-y-3">
                                                {selectedNode.resources.map((res, i) => (
                                                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all group">
                                                        <span className="text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">{res.title}</span>
                                                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    {selectedNode.status === 'active' && (
                                        <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-[#0A101F] to-transparent">
                                            <button
                                                onClick={handleComplete}
                                                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <><CheckCircle className="w-5 h-5" /> Mark Mission Complete</>
                                            </button>
                                            <p className="text-center text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-wider">Reward: {selectedNode.xp} XP</p>
                                        </div>
                                    )}
                                    {selectedNode.status === 'completed' && (
                                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-500 font-bold justify-center">
                                            <CheckCircle className="w-5 h-5" /> Mission Completed
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
