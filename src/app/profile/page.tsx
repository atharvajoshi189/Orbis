"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";
import { Download, Share2, Map, Zap, Shield, Target, Trophy, ChevronLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { EditProfileModal } from "@/components/profile/EditProfileModal";

const statsData = [
    { subject: 'Coding', A: 120, fullMark: 150 },
    { subject: 'Design', A: 98, fullMark: 150 },
    { subject: 'Strategy', A: 86, fullMark: 150 },
    { subject: 'Leadership', A: 99, fullMark: 150 },
    { subject: 'Logic', A: 85, fullMark: 150 },
    { subject: 'Comm', A: 65, fullMark: 150 },
];

const activitiesData = [
    { id: 1, type: 'mission', title: 'Mission Accomplished', desc: 'Completed "Frontend Mastery" roadmap', date: '2 hours ago', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { id: 2, type: 'skill', title: 'Skill Acquired', desc: 'Mastered "React Hooks" module', date: '5 hours ago', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 3, type: 'profile', title: 'Profile Updated', desc: 'Updated bio and social links', date: '1 day ago', icon: Edit, color: 'text-green-400', bg: 'bg-green-500/10' },
    { id: 4, type: 'badge', title: 'New Badge Earned', desc: 'Received "Code Warrior" badge', date: '2 days ago', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function ProfilePage() {
    const { user } = useAppStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [activeMissions, setActiveMissions] = useState<any[]>([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // 1. Fetch Profile Data
                const { data: student } = await supabase
                    .from('students')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (student) setProfile(student);

                // 2. Fetch Active Missions
                const { data: roadmaps } = await supabase
                    .from('active_roadmaps')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('is_active', true);

                if (roadmaps) setActiveMissions(roadmaps);

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleDownloadCV = () => {
        toast.success("Generating Operative Dossier...");
        // Placeholder for PDF generation logic
        setTimeout(() => toast.info("Download started (Simulation)"), 1500);
    };

    const handleUpdateProfile = async (updatedData: any) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('students')
                .update(updatedData)
                .eq('user_id', user.id);

            if (error) throw error;

            setProfile((prev: any) => ({ ...prev, ...updatedData }));
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-cyan-500">
            <Zap className="animate-bounce mr-2" /> Initializing Command Center...
        </div>;
    }

    return (
        <div className="min-h-screen font-sans bg-[#050B14] text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container-custom mx-auto pt-28 pb-12 px-4">

                {/* Breadcrumb & Welcome */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft size={16} /> Return to Dashboard
                    </button>
                    {profile && (
                        <div className="text-right hidden md:block">
                            <h2 className="text-2xl font-black text-white">
                                Welcome back, <span className="text-cyan-400">{profile.name}</span>
                            </h2>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Operative Status: Active</p>
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: ID CARD (Sidebar) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-[2rem] bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-scan" />

                            <CardHeader className="text-center pt-10 pb-2 relative z-10">
                                <div className="relative mx-auto mb-6 h-40 w-40">
                                    {/* Rotating Rings */}
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-dashed animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute -inset-2 rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]" />

                                    <Avatar className="h-full w-full border-4 border-[#050B14] shadow-2xl">
                                        <AvatarImage src="/avatar-placeholder.png" className="object-cover" />
                                        <AvatarFallback className="bg-cyan-950 text-3xl font-black text-cyan-500">
                                            {profile?.name?.charAt(0) || 'OP'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase tracking-widest border-2 border-[#050B14] shadow-xl whitespace-nowrap">
                                        Level {profile?.level || 1}
                                    </Badge>
                                </div>

                                <CardTitle className="text-3xl font-black text-white mt-6 mb-1">{profile?.name || "Unknown Operative"}</CardTitle>
                                <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs">
                                    {profile?.uni || "Unassigned University"}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-8 pt-6 relative z-10">
                                {/* Key Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="rounded-2xl bg-black/40 p-4 border border-white/5 backdrop-blur-md">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Class</p>
                                        <p className="font-bold text-cyan-300">Strategist</p>
                                    </div>
                                    <div className="rounded-2xl bg-black/40 p-4 border border-white/5 backdrop-blur-md">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total XP</p>
                                        <p className="font-bold text-yellow-400">{profile?.xp || 0}</p>
                                    </div>
                                </div>

                                {/* Rank Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-slate-400">Rank Progress</span>
                                        <span className="text-cyan-400">{(profile?.xp % 1000) / 10}%</span>
                                    </div>
                                    <Progress value={(profile?.xp % 1000) / 10} className="h-2 bg-slate-800" indicatorColor="bg-gradient-to-r from-cyan-500 to-blue-500" />
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Button onClick={handleDownloadCV} variant="outline" className="h-12 border-white/10 hover:bg-white/5 hover:text-cyan-400 font-bold rounded-xl gap-2">
                                        <Download size={16} /> CV / Resume
                                    </Button>
                                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 hover:text-purple-400 font-bold rounded-xl gap-2">
                                        <Share2 size={16} /> Share ID
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditModalOpen(true)}
                                        variant="outline"
                                        className="col-span-2 h-12 border-white/10 hover:bg-white/5 hover:text-green-400 font-bold rounded-xl gap-2"
                                    >
                                        <Edit size={16} /> Edit Profile Data
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <EditProfileModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            profile={profile}
                            onSave={handleUpdateProfile}
                        />
                    </div>

                    {/* RIGHT COLUMN: MAIN CONTENT */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Attribute Analysis (Radar Chart + Stats) */}
                        <Card className="rounded-[2.5rem] bg-white/5 backdrop-blur-xl border-white/10 shadow-lg overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Target size={20} /></div>
                                    <CardTitle className="text-xl font-bold text-white uppercase tracking-wide">Attribute Analysis</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-2 gap-12 items-center">

                                    {/* Chart */}
                                    <div className="h-[300px] w-full relative">
                                        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full" />
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={statsData}>
                                                <PolarGrid stroke="#334155" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                                <Radar
                                                    name="Attributes"
                                                    dataKey="A"
                                                    stroke="#06b6d4"
                                                    strokeWidth={2}
                                                    fill="#06b6d4"
                                                    fillOpacity={0.2}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Stats Bars */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider">CGPA Power</span>
                                                <span className="text-cyan-400 font-black text-lg">{profile?.gpa || "N/A"}</span>
                                            </div>
                                            <Progress value={(parseFloat(profile?.gpa || '0') / 10) * 100} className="h-2 bg-slate-800" indicatorColor="bg-gradient-to-r from-cyan-500 to-cyan-300 box-shadow-[0_0_10px_cyan]" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider">Skill Match</span>
                                                <span className="text-purple-400 font-black text-lg">High</span>
                                            </div>
                                            <Progress value={85} className="h-2 bg-slate-800" indicatorColor="bg-gradient-to-r from-purple-600 to-purple-400" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider">Financial Strength</span>
                                                <span className="text-green-400 font-black text-lg">Solid</span>
                                            </div>
                                            <Progress value={75} className="h-2 bg-slate-800" indicatorColor="bg-gradient-to-r from-green-600 to-green-400" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Active Missions */}
                        <Card className="rounded-[2.5rem] bg-white/5 backdrop-blur-xl border-white/10 shadow-lg overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500"><Trophy size={20} /></div>
                                    <CardTitle className="text-xl font-bold text-white uppercase tracking-wide">Active Missions</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {activeMissions.length > 0 ? (
                                    <div className="divide-y divide-white/5">
                                        {activeMissions.map((mission, i) => (
                                            <div key={i} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg">
                                                        {mission.current_day}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors mb-1">
                                                            Day {mission.current_day}: {mission.career_path}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 font-medium">
                                                            {mission.roadmap_type.replace('_', ' ').toUpperCase()} Protocol
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => router.push('/career-path/roadmap')}
                                                    className="bg-white/10 hover:bg-cyan-500 hover:text-black text-white font-bold rounded-xl transition-all"
                                                >
                                                    Resume <ChevronLeft className="rotate-180 ml-2" size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4 text-slate-500">
                                            <Map size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">No Active Protocols</h3>
                                        <p className="text-slate-500 mb-6">Initialize a career vector to beginning your journey.</p>
                                        <Button
                                            onClick={() => router.push('/career-path')}
                                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-6 rounded-xl"
                                        >
                                            Initialize Protocol
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. Recent Activities */}
                        <Card className="rounded-[2.5rem] bg-white/5 backdrop-blur-xl border-white/10 shadow-lg overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Map size={20} /></div>
                                    <CardTitle className="text-xl font-bold text-white uppercase tracking-wide">Recent Logs</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {activitiesData.map((activity) => (
                                        <div key={activity.id} className="p-6 hover:bg-white/5 transition-colors flex items-center gap-5 group">
                                            <div className={`h-12 w-12 rounded-xl ${activity.bg} ${activity.color} flex items-center justify-center`}>
                                                <activity.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors mb-1">
                                                        {activity.title}
                                                    </h4>
                                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{activity.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    {activity.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 text-center border-t border-white/5">
                                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 w-full">
                                        View All Activity
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
