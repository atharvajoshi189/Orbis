"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";

interface MissionWidgetProps {
    xp: number;
    level: number;
    completedMissions: string[];
    activeRoadmap?: any;
    onUpdate: () => void; // Callback to refresh parent data
}

const MISSIONS = [
    { id: 'upload_cv', title: 'Upload Your CV', xp: 100, icon: FileText },
    { id: 'add_skills', title: 'Add 5 Core Skills', xp: 50, icon: Zap },
    { id: 'set_goal', title: 'Set Career Goal', xp: 50, icon: Target },
    { id: 'connect_github', title: 'Link GitHub Profile', xp: 150, icon: Trophy },
];

import { FileText } from "lucide-react";

export function MissionWidget({ xp, level, completedMissions = [], onUpdate }: MissionWidgetProps) {
    const { user } = useAppStore();
    const [loading, setLoading] = useState(false);

    // Find first uncompleted mission
    const currentMission = MISSIONS.find(m => !completedMissions.includes(m.id)) || null;

    const nextLevelXP = level * 500;
    const progress = (xp / nextLevelXP) * 100;

    const handleCompleteMission = async () => {
        if (!currentMission || !user) return;
        setLoading(true);

        try {
            // Optimistic Update
            const newXP = xp + currentMission.xp;
            const newCompleted = [...completedMissions, currentMission.id];

            // Calculate Level Up
            let newLevel = level;
            if (newXP >= nextLevelXP) {
                newLevel += 1;
                toast.success(`LEVEL UP! You are now Level ${newLevel}`, {
                    icon: <Trophy className="text-yellow-400" />,
                    duration: 5000
                });
            } else {
                toast.success(`Mission Complete! +${currentMission.xp} XP`);
            }

            const { error } = await supabase
                .from('students')
                .update({
                    xp: newXP,
                    level: newLevel,
                    completed_missions: newCompleted
                })
                .eq('user_id', user.id);

            if (error) throw error;
            onUpdate(); // Refresh parent

        } catch (error) {
            console.error(error);
            toast.error("Failed to update mission progress");
        } finally {
            setLoading(false);
        }
    };

    if (!currentMission) {
        return (
            <Card className="bg-gradient-to-r from-yellow-900/20 to-black border-yellow-500/30 relative overflow-hidden">
                <CardContent className="pt-6 flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-full">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase italic">All Missions Complete</h3>
                        <p className="text-sm text-yellow-500/80">You represent the elite. Stand by for new orders.</p>
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
                            Current Objective • Level {level}
                        </div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            {currentMission.title}
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-yellow-400 drop-shadow-lg">
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
                            <span>Progress to Lvl {level + 1}</span>
                            <span>{Math.floor(nextLevelXP - xp)} XP needed</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-slate-800" indicatorColor="bg-gradient-to-r from-cyan-500 to-blue-500" />
                    </div>
                </div>

                <Button
                    onClick={handleCompleteMission}
                    disabled={loading}
                    className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest text-xs h-10 group-hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all"
                >
                    {loading ? "Verifying..." : `Complete Mission (+${currentMission.xp} XP)`}
                </Button>
            </CardContent>
        </Card>
    );
}
