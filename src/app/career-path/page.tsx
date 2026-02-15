"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, Loader2, Brain, Globe, Briefcase, ChevronRight, Zap, Target, ShieldCheck, TrendingUp, Search, Clock, Award, Rocket, ArrowRight } from 'lucide-react';
import { analyzeDocument, ExtractedData } from '@/lib/documentAnalyzer';
import { buildProfileFromDocuments, UnifiedProfile } from '@/lib/profileBuilder';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/utils/supabase/client";
import { useAppStore } from "@/lib/store";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types for AI Response
type CareerOption = {
    title: string;
    match_score: number;
    reason: string;
    market_outlook: string;
};

type Roadmap = {
    type: 'fast_track' | 'growth' | 'mastery';
    duration: string;
    total_xp: number;
    milestones: { day: number; title: string; task: string; xp: number }[];
    description: string;
};

export default function CareerPathPage() {
    const { user } = useAppStore();
    const router = useRouter();

    // Hub Mode State
    const [activeRoadmapToken, setActiveRoadmapToken] = useState<any>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Steps: 1=Verification, 2=Discovery, 3=Roadmaps
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    // Step 1 Data
    const [documents, setDocuments] = useState<File[]>([]);
    const [profile, setProfile] = useState<UnifiedProfile | null>(null);
    const [hasExistingProfile, setHasExistingProfile] = useState(false);

    // Step 2 Data
    const [careerOptions, setCareerOptions] = useState<CareerOption[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Step 3 Data
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

    // Initial Fetch & Active Protocol Check
    useEffect(() => {
        const initPage = async () => {
            if (!user) return;

            // 1. Check for Active Roadmap
            const { data: roadmap } = await supabase
                .from('active_roadmaps')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (roadmap) {
                setActiveRoadmapToken(roadmap);
            }

            // 2. Fetch Existing Profile
            const { data } = await supabase.from('students').select('*').eq('user_id', user.id).single();

            if (data && data.gpa) {
                setProfile({
                    personal: { name: data.name },
                    educationHistory: [{ level: 'University', score: data.gpa, stream: data.field, institution: data.uni, year: 2024, subjects: [] }],
                    subjectStrength: [],
                    gpa: parseFloat(data.gpa),
                    certifications: data.skills || [],
                    entranceScores: []
                });
                setHasExistingProfile(true);
            }
        };
        initPage();
    }, [user, router]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    // ACTION: Analyze Documents (if no profile or user wants new)
    const processDocuments = async () => {
        setIsLoading(true);
        setLoadingText("Extracting Academic DNA...");
        try {
            const extractions = await Promise.all(documents.map(analyzeDocument));
            const userProfile = buildProfileFromDocuments(extractions);
            setProfile(userProfile);
            await generateCareerOptions(userProfile);
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze documents");
            setIsLoading(false);
        }
    };

    // ACTION: Confirm Existing Profile
    const confirmProfile = async () => {
        if (!profile) return;
        await generateCareerOptions(profile);
    };

    // ACTION: Generate Career Options (Step 1 -> 2)
    const generateCareerOptions = async (p: UnifiedProfile) => {
        setIsLoading(true);
        setLoadingText("Calibrating Global Opportunities...");
        try {
            const res = await fetch('/api/career/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userProfile: p })
            });
            const data = await res.json();
            if (data.options) {
                setCareerOptions(data.options);
                setStep(2);
            }
        } catch (error) {
            console.error(error);
            toast.error("AI Generation Failed");
        } finally {
            setIsLoading(false);
        }
    };

    // ACTION: Search Custom Path
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        generateRoadmaps(searchQuery);
    };

    // ACTION: Select Path & Generate Roadmaps (Step 2 -> 3)
    const generateRoadmaps = async (path: string) => {
        setSelectedPath(path);
        setIsLoading(true);
        setLoadingText(`Architecting ${path} Trajectories...`);
        try {
            const res = await fetch('/api/career/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userProfile: profile, selectedPath: path })
            });
            const data = await res.json();
            if (data.roadmaps) {
                setRoadmaps(data.roadmaps);
                setStep(3);
            }
        } catch (error) {
            console.error(error);
            toast.error("Roadmap Generation Failed");
        } finally {
            setIsLoading(false);
        }
    };

    // ACTION: Select Final Roadmap (Step 3 -> Dashboard)
    const selectRoadmap = async (roadmap: Roadmap) => {
        if (!user || !selectedPath) return;
        setIsLoading(true);
        setLoadingText("Initializing Mission Protocol...");
        try {
            // 1. Deactivate any existing active roadmaps to prevent duplicates
            await supabase
                .from('active_roadmaps')
                .update({ is_active: false })
                .eq('user_id', user.id);

            // 2. Insert new roadmap
            const { error } = await supabase.from('active_roadmaps').insert({
                user_id: user.id,
                career_path: selectedPath,
                roadmap_type: roadmap.type,
                milestones: roadmap.milestones,
                total_xp: roadmap.total_xp,
                current_day: 1
            });

            if (error) throw error;

            toast.success("Mission Protocol Activated!");
            router.push('/career-path/roadmap');
        } catch (error: any) {
            console.error('Roadmap Save Error:', error);
            if (error.message) console.error('Message:', error.message);

            toast.error(`Failed to save roadmap: ${error.message || 'Please check console for details'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300 bg-slate-50 dark:bg-[#050B14]">
            <Navbar />

            <main className="container-custom mx-auto pt-32 pb-12 px-4 relative z-10">

                {/* Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-md flex flex-col items-center justify-center"
                        >
                            <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6" />
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest animate-pulse">{loadingText}</h2>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* VIEW: HUB DASHBOARD (IF ACTIVE PROTOCOL EXISTS) */}
                {activeRoadmapToken && !isCreatingNew ? (
                    <div className="max-w-5xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter font-outfit">
                                Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Control</span>
                            </h1>
                            <p className="text-slate-500 text-lg">Active protocol detected. Resume operations or initialize a new vector.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Card 1: Active Protocol */}
                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50"><Target className="w-24 h-24 text-cyan-500/10" /></div>

                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" /> Live Protocol
                                </div>

                                <h3 className="text-3xl font-black uppercase text-white mb-2">{activeRoadmapToken.career_path}</h3>
                                <p className="text-slate-400 font-medium mb-8">
                                    Status: Day {activeRoadmapToken.current_day} <span className="text-slate-600 mx-2">|</span> {activeRoadmapToken.roadmap_type.replace('_', ' ')}
                                </p>

                                <button
                                    onClick={() => router.push('/career-path/roadmap')}
                                    className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02]"
                                >
                                    Resume Protocol <ArrowRight size={18} />
                                </button>
                            </div>

                            {/* Card 2: New Vector */}
                            <div className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                                        <Rocket size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Initialize New Vector</h3>
                                    <p className="text-slate-500">Archive current progress and calculate a new career trajectory based on updated parametrics.</p>
                                </div>

                                <button
                                    onClick={() => setIsCreatingNew(true)}
                                    className="w-full py-4 bg-slate-200 dark:bg-white/10 hover:bg-purple-600 hover:text-white text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all"
                                >
                                    <Search size={18} /> Explore New Paths
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* VIEW: STEPS (VERIFICATION -> DISCOVERY -> ROADMAPS) */
                    <>
                        {/* Back Button if in "New Mode" */}
                        {isCreatingNew && activeRoadmapToken && (
                            <button
                                onClick={() => setIsCreatingNew(false)}
                                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-cyan-500 font-bold text-sm uppercase tracking-widest"
                            >
                                <ChevronRight className="rotate-180" size={16} /> Return to Mission Control
                            </button>
                        )}

                        {/* STEP 1: DATA VERIFICATION */}
                        {step === 1 && (
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-12">
                                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 uppercase tracking-tighter font-outfit">
                                        Intelligence <span className="text-slate-900 dark:text-white">Hub</span>
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg">Initialize your career vector. Verify your data to begin.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Option A: Existing Profile */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`p-8 rounded-3xl border ${hasExistingProfile ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-200 dark:border-white/10 opacity-50 pointer-events-none'}`}
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500"><Target size={32} /></div>
                                            <h3 className="text-2xl font-bold">Existing Profile</h3>
                                        </div>
                                        {hasExistingProfile && profile ? (
                                            <div className="space-y-4 mb-8">
                                                <div className="flex justify-between items-center p-3 bg-white dark:bg-black/20 rounded-xl">
                                                    <span className="text-slate-500 font-bold text-sm">CGPA</span>
                                                    <span className="text-xl font-black">{profile.gpa}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-white dark:bg-black/20 rounded-xl">
                                                    <span className="text-slate-500 font-bold text-sm">Stream</span>
                                                    <span className="text-lg font-bold">{profile.educationHistory[0].stream}</span>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-black/20 rounded-xl">
                                                    <span className="text-slate-500 font-bold text-sm block mb-2">Skills</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {profile.certifications.slice(0, 3).map((s, i) => (
                                                            <span key={i} className="text-xs font-bold px-2 py-1 bg-cyan-500/10 text-cyan-600 rounded">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 italic mb-8">No profile data found. Please upload documents.</div>
                                        )}
                                        <button
                                            onClick={confirmProfile}
                                            disabled={!hasExistingProfile}
                                            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                                        >
                                            Confirm & Analyze <ChevronRight size={18} />
                                        </button>
                                    </motion.div>

                                    {/* Option B: Upload New */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><Upload size={32} /></div>
                                            <h3 className="text-2xl font-bold">New Scan</h3>
                                        </div>

                                        <div className="relative h-48 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center mb-8 bg-white/50 dark:bg-black/20 group-hover:bg-transparent transition-colors">
                                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
                                            <Upload className="mb-2 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drop files here</span>
                                            {documents.length > 0 && <span className="mt-2 text-green-500 font-bold text-xs">{documents.length} files queued</span>}
                                        </div>

                                        <button
                                            onClick={processDocuments}
                                            disabled={documents.length === 0}
                                            className="w-full py-4 bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Scan & Analyze
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: ELIGIBILITY & DISCOVERY */}
                        {step === 2 && (
                            <div className="animate-fade-in-up">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-black mb-2 uppercase">Optimal Vectors</h2>
                                    <p className="text-slate-500">AI-calibrated paths based on your profile.</p>
                                </div>

                                {/* Search Bar */}
                                <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16 relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                                    <div className="relative flex items-center bg-white dark:bg-[#0A101F] border border-cyan-500/50 rounded-full p-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                        <Search className="ml-4 text-cyan-500" />
                                        <input
                                            type="text"
                                            placeholder="Search custom career (e.g., 'Blockchain Developer')"
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white px-4 font-medium placeholder:text-slate-400"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button type="submit" className="p-3 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-colors">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </form>

                                {/* Options Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {careerOptions.map((option, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -10 }}
                                            onClick={() => generateRoadmaps(option.title)}
                                            className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 rounded-3xl cursor-pointer hover:border-cyan-500/50 hover:shadow-xl transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white">
                                                    <Briefcase size={20} />
                                                </div>
                                                <span className="text-sm font-black text-green-500">{option.match_score}% Match</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-500 transition-colors">{option.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{option.reason}</p>
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Outlook: <span className="text-cyan-500">{option.market_outlook}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: TRIPLE TIMELINE */}
                        {step === 3 && selectedPath && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setStep(2)} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-cyan-500 font-bold text-sm uppercase tracking-widest">
                                    <ChevronRight className="rotate-180" size={16} /> Back to Discovery
                                </button>

                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-black mb-2 uppercase">Protocol Selection</h2>
                                    <p className="text-slate-500 text-lg">Choose your velocity for <span className="text-cyan-500 font-bold">{selectedPath}</span>.</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {roadmaps.map((map, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -10, scale: 1.02 }}
                                            className={`relative p-8 rounded-[2.5rem] border overflow-hidden flex flex-col ${map.type === 'fast_track' ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500' :
                                                map.type === 'growth' ? 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-500' :
                                                    'bg-purple-500/5 border-purple-500/30 hover:border-purple-500'
                                                }`}
                                        >
                                            {/* Header */}
                                            <div className="mb-8">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${map.type === 'fast_track' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                                                    map.type === 'growth' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' :
                                                        'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                                    }`}>
                                                    <Clock size={12} /> {map.duration}
                                                </div>
                                                <h3 className="text-3xl font-black uppercase text-slate-900 dark:text-white mb-2">
                                                    {map.type.replace('_', ' ')}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                                    {map.description}
                                                </p>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="p-4 bg-white dark:bg-black/20 rounded-2xl">
                                                    <div className="text-sm text-slate-500 font-bold mb-1">XP Gain</div>
                                                    <div className="text-2xl font-black text-slate-800 dark:text-white">+{map.total_xp}</div>
                                                </div>
                                                <div className="p-4 bg-white dark:bg-black/20 rounded-2xl">
                                                    <div className="text-sm text-slate-500 font-bold mb-1">Intensity</div>
                                                    <div className="text-2xl font-black text-slate-800 dark:text-white">
                                                        {map.type === 'fast_track' ? 'High' : map.type === 'growth' ? 'Med' : 'Deep'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Milestones Preview */}
                                            <div className="flex-1 mb-8 space-y-3">
                                                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Milestones Preview</h4>
                                                {map.milestones.slice(0, 3).map((m, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 text-sm">
                                                        <div className={`w-2 h-2 rounded-full ${map.type === 'fast_track' ? 'bg-orange-500' :
                                                            map.type === 'growth' ? 'bg-cyan-500' : 'bg-purple-500'
                                                            }`} />
                                                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{m.title}</span>
                                                    </div>
                                                ))}
                                                {map.milestones.length > 3 && <div className="text-xs text-slate-400 italic">+ {map.milestones.length - 3} more</div>}
                                            </div>

                                            <button
                                                onClick={() => selectRoadmap(map)}
                                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${map.type === 'fast_track' ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30' :
                                                    map.type === 'growth' ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' :
                                                        'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                    }`}
                                            >
                                                Initialize Protocol
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
