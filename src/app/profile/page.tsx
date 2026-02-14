"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Download, Shield, Trophy, LogOut, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
    const { user, logout } = useAppStore();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data) setProfileData(data);
        };
        fetchProfile();
    }, [user]);

    // Handle Logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        router.push("/login");
    };

    // Get initials
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "OP";

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            <Navbar />

            {/* Edit Modal */}
            <EditProfileModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                currentProfile={profileData}
                onUpdate={() => {
                    // Refetch data
                    const fetchProfile = async () => {
                        if (!user) return;
                        const { data } = await supabase.from('students').select('*').eq('user_id', user.id).single();
                        if (data) setProfileData(data);
                    };
                    fetchProfile();
                }}
            />

            <div className="container-custom mx-auto pt-24 pb-12 px-4">

                {/* Breadcrumb & Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors gap-2 text-sm font-bold uppercase tracking-wider">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        size="sm"
                        className="uppercase font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>

                <div className="max-w-xl mx-auto">

                    {/* CENTERED IDENTITY CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <Card className="bg-black/40 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />

                            <CardHeader className="text-center pb-6 pt-8">
                                <div className="relative mx-auto mb-6 h-32 w-32 group">
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 border-dashed animate-[spin_10s_linear_infinite]" />
                                    <Avatar className="h-full w-full border-4 border-black/50 shadow-2xl">
                                        <AvatarImage src={user?.avatar || "/avatar-placeholder.png"} />
                                        <AvatarFallback className="bg-cyan-950 text-cyan-400 text-3xl font-black">{initials}</AvatarFallback>
                                    </Avatar>
                                    <Badge variant="outline" className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-black border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                        Level 5
                                    </Badge>
                                </div>

                                <CardTitle className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                                    {user?.name || "Operative"}
                                </CardTitle>
                                <div className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4">
                                    Strategist Class
                                </div>

                                <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-purple-400" />
                                        <span>Security: High</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="w-3 h-3 text-yellow-400" />
                                        <span>Rank: #42</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <Button
                                    onClick={() => window.print()}
                                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 uppercase font-black tracking-widest text-xs h-12 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-all"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download Operative CV
                                </Button>

                                <Button
                                    onClick={() => setIsEditOpen(true)}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 uppercase font-black tracking-widest text-xs h-12 transition-all"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                                </Button>
                            </CardContent>
                        </Card>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
