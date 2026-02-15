"use client";
import Translate from "@/components/Translate";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Zap, Clock, Map, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";
import Link from 'next/link';

interface MissionWidgetProps {
    xp: number;
    level: number;
    completedMissions: string[];
    activeRoadmap?: any;
    onUpdate: () => void; // Callback to refresh parent data
}

// Fallback missions if no roadmap is active
const FALLBACK_MISSIONS = [
    { id: 'upload_cv', title: 'Upload Your CV', xp: 100, icon: Map },
    { id: 'add_skills', title: 'Add 5 Core Skills', xp: 50, icon: Zap },
    { id: 'set_goal', title: 'Set Career Goal', xp: 50, icon: Target },
];

export function MissionWidget({ xp, level, completedMissions = [], activeRoadmap, onUpdate }: MissionWidgetProps) {
    const { user } = useAppStore();
    const [loading, setLoading] = useState(false);

    // DETERMINE CURRENT MISSION
    let currentMission: any = null;
    let isRoadmapMission = false;

    if (activeRoadmap && activeRoadmap.milestones) {
        // Find mission for the current day
        const dayMission = activeRoadmap.milestones.find((m: any) => m.day === activeRoadmap.current_day);
        if (dayMission) {
            currentMission = {
                id: `day_${dayMission.day}`,
                title: dayMission.title, // e.g., "Day 1: Python Basics"
                task: dayMission.task,   // Description
                xp: dayMission.xp,
                icon: Clock,
                isRoadmap: true
            };
            isRoadmapMission = true;
        }
    }

    // Fallback if no roadmap active
    if (!currentMission) {
        currentMission = FALLBACK_MISSIONS.find(m => !completedMissions.includes(m.id)) || null;
    }

    const nextLevelXP = level * 1000;
    const progress = (xp / nextLevelXP) * 100;

    const handleCompleteMission = async () => {
        if (!currentMission || !user) return;
        setLoading(true);

        try {
            // 1. Update Student XP
            const newXP = xp + currentMission.xp;
            let newLevel = level;

            // Check Level Up
            if (newXP >= nextLevelXP) {
                newLevel += 1;
                toast.success(`LEVEL UP! You are now Level ${newLevel}`, {
                    icon: <Trophy className="text-yellow-400" />,
                    duration: 5000
                });
            } else {
                toast.success(`Mission Complete! +${currentMission.xp} XP`);
            }

            // Update User Profile
            const { error: profileError } = await supabase
                .from('students')
                .update({
                    xp: newXP,
                    level: newLevel,
                    // Only add to completed_missions if it's a fallback mission
                    completed_missions: !isRoadmapMission ? [...completedMissions, currentMission.id] : completedMissions
                })
                .eq('user_id', user.id);

            if (profileError) throw profileError;

            // 2. If Roadmap Mission, Update Roadmap Day
            if (isRoadmapMission && activeRoadmap) {
                const { error: roadmapError } = await supabase
                    .from('active_roadmaps')
                    .update({
                        current_day: activeRoadmap.current_day + 1
                    })
                    .eq('id', activeRoadmap.id);

                if (roadmapError) throw roadmapError;
            }

            onUpdate(); // Refresh parent

        } catch (error) {
            console.error(error);
            toast.error("Failed to update mission progress");
        } finally {
            setLoading(false);
        }
    };

    // ALL MISSIONS COMPLETE STATE
    if (!currentMission) {
        return (
            <Card className="bg-gradient-to-r from-yellow-900/20 to-black border-yellow-500/30 relative overflow-hidden">
                <CardContent className="pt-6 flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-full">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase italic"><Translate text="All Systems Go" /></h3>
                        <p className="text-sm text-yellow-500/80"><Translate text="Pending next directive." /></p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const Icon = currentMission.icon;

    return (
        <Card className="bg-slate-900 border-slate-800 relative overflow-hidden group">
            {/* XP Bar Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>

            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-[10px] font-bold uppercase text-cyan-400 tracking-widest mb-1">
                            {isRoadmapMission ?
                                <><Link href="/career-path/roadmap" className="hover:text-cyan-300 transition-colors underline decoration-dotted"><Translate text="Active Protocol" /></Link> • <Translate text="Day" /> {activeRoadmap.current_day}</>
                                :
                                <><Translate text="Onboarding" /> • <Translate text="Level" /> {level}</>
                            }
                        </div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <Translate text={currentMission.title} />
                        </h3>
                        {isRoadmapMission && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{currentMission.task}</p>}
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-black text-yellow-400 drop-shadow-lg">
                            {xp} <span className="text-xs text-yellow-600">XP</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-950 rounded-xl border border-cyan-500/30">
                        <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span><Translate text="Next Level" /> {level + 1}</span>
                            <span>{Math.floor(nextLevelXP - xp)} <Translate text="XP to go" /></span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-slate-800" indicatorColor="bg-gradient-to-r from-cyan-500 to-blue-500" />
                    </div>
                </div>

                <Button
                    onClick={handleCompleteMission}
                    disabled={loading}
                    className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest text-xs h-10 group-hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all"
                >
                    {loading ? <Translate text="Verifying..." /> : <><Translate text="Complete Mission" /> (+{currentMission.xp} XP)</>}
                </Button>
            </CardContent>
        </Card>
    );
}
