"use client";

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    Upload, FileText, CheckCircle, Loader2, Brain, Globe,
    Briefcase, ChevronRight, Zap, ShieldCheck, PieChart,
    TrendingUp, FileDown, Rocket, Target, Star, User
} from 'lucide-react';
import { analyzeDocument, ExtractedData } from '@/lib/documentAnalyzer';
import { buildProfileFromDocuments, UnifiedProfile } from '@/lib/profileBuilder';
import {
    evaluateGlobalOptions, GlobalOpportunity,
    generateIntelligence, IntelligenceOutput,
    generateMissionTimeline, TimelineStep
} from '@/lib/globalEligibilityEngine';
import { generateCareerMap, CareerPath } from '@/lib/careerMappingEngine';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
    Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { supabase } from "@/utils/supabase/client";

export default function GuidancePage() {
    const [step, setStep] = useState(0); // 0: Selection, 1: Upload, 2: Results, 3: Pricing
    const [mode, setMode] = useState<'AI' | 'HUMAN' | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [documents, setDocuments] = useState<File[]>([]);
    const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
    const [profile, setProfile] = useState<UnifiedProfile | null>(null);
    const [globalOps, setGlobalOps] = useState<GlobalOpportunity[]>([]);
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [intelligence, setIntelligence] = useState<IntelligenceOutput | null>(null);
    const [timeline, setTimeline] = useState<TimelineStep[]>([]);
    const [ieltsSim, setIeltsSim] = useState(6.5);
    const [activeView, setActiveView] = useState<'GLOBAL' | 'CAREER' | 'MISSION'>('GLOBAL');
    const [aiLogs, setAiLogs] = useState<string[]>([]);
    const [showAssistant, setShowAssistant] = useState(false);
    const [assistantMessage, setAssistantMessage] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments([...documents, ...Array.from(e.target.files)]);
        }
    };

    useEffect(() => {
        const checkRoadmap = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: roadmap } = await supabase
                .from('active_roadmaps')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();

            if (roadmap && roadmap.current_step === 0) {
                const msgs: any = {
                    'fast_track': "Speed is key. I've initiated the Fast Track protocol on your dashboard.",
                    'growth': "Excellent choice. The Growth trajectory is live on your dashboard. Let's build your foundation.",
                    'mastery': "A bold decision. The Mastery path has been encrypted. Check your dashboard for the first mission."
                };
                setAssistantMessage(msgs[roadmap.type] || "Great choice! Day 1 is live on your dashboard. Let's get started.");
                setShowAssistant(true);
            }
        };
        checkRoadmap();
    }, []);

    const runAnalysis = async (isDemo = false) => {
        setIsAnalyzing(true);
        try {
            let userProfile: UnifiedProfile;

            if (isDemo) {
                userProfile = {
                    personal: { name: "Alex Doe" },
                    educationHistory: [
                        { level: '12th', institution: 'Metropolis Academy', year: 2024, score: '91.4%', stream: 'Science (PCM)', subjects: ['Physics', 'Math', 'CS'] },
                        { level: '10th', institution: 'Greenwood High', year: 2022, score: '94%', stream: 'General', subjects: ['Math', 'Science', 'English'] }
                    ],
                    subjectStrength: [
                        { subject: 'Computer Science', score: 97 },
                        { subject: 'Mathematics', score: 95 },
                        { subject: 'Physics', score: 92 },
                        { subject: 'Chemistry', score: 88 },
                        { subject: 'English', score: 85 }
                    ],
                    gpa: 3.8,
                    certifications: ['AWS Certified Cloud Practitioner', 'Google Data Analytics'],
                    entranceScores: [{ exam: 'IELTS', score: '7.5' }]
                };
            } else {
                const extractions = await Promise.all(documents.map(analyzeDocument));
                setExtractedData(extractions);
                userProfile = buildProfileFromDocuments(extractions);
            }

            setProfile(userProfile);
            setGlobalOps(evaluateGlobalOptions(userProfile));
            setCareerPaths(generateCareerMap(userProfile));
            setIntelligence(generateIntelligence(userProfile));
            setTimeline(generateMissionTimeline(userProfile));

            setAiLogs([
                "Initializing Neural Link...",
                "Extracting Academic DNA...",
                "Cross-referencing Global Markets...",
                "Predicting Career Trajectories...",
                "Mission Parameters Defined."
            ]);

            setStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300 overflow-x-hidden relative">
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <main className="container-custom mx-auto pt-32 pb-12 px-4 relative z-10 min-h-[calc(100vh-80px)]">

                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-[#060a14] flex flex-col items-center justify-center p-8 backdrop-blur-xl"
                        >
                            <div className="relative w-80 h-80 mb-12">
                                {/* Orbital rings */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-primary/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-4 border border-purple-500/20 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Brain className="w-24 h-24 text-primary animate-pulse" />
                                </div>
                                <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                            </div>

                            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter mb-4 text-center">
                                {mode === 'HUMAN' ? 'Initializing Elite ' : 'Generating Neural '}
                                <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Projection</span>
                            </h2>
                            <div className="flex items-center gap-3 text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">
                                <Loader2 className="w-4 h-4 animate-spin" /> Calibrating Mission Parameters...
                            </div>

                            <div className="mt-12 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* STEP 0: MODE SELECTION */}
                {step === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-5xl mx-auto py-12 px-4"
                    >
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] font-outfit text-slate-900 dark:text-white transition-colors">
                                Select <span className="text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Guidance</span>, <br />
                                <span className="text-slate-700 dark:text-white/90">Protocol.</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed border-l-2 border-primary/30 pl-6 ml-auto mr-auto">
                                Choose between automated neural prediction or elite expert-led strategy.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* FREE AI MODE */}
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                onClick={() => { setMode('AI'); setStep(1); }}
                                className="group relative bg-white dark:bg-[#111827]/60 border border-slate-200 dark:border-white/5 p-12 rounded-[3rem] cursor-pointer hover:border-primary/50 transition-all overflow-hidden shadow-xl dark:shadow-none"
                            >
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-10 border border-primary/20 group-hover:rotate-6 transition-transform">
                                        <Brain className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Neural AI Avatar</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 text-lg font-medium">
                                        Instant, automated analysis using the Orbis Core engine.
                                        Ideal for rapid university matching & risk assessment.
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                        Free Tier Deployment <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* PAID HUMAN MODE */}
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                onClick={() => { setMode('HUMAN'); setStep(3); }}
                                className="group relative bg-slate-900 dark:bg-[#0a0514]/80 border border-purple-500/30 dark:border-purple-500/10 p-12 rounded-[3rem] cursor-pointer hover:border-purple-500/50 transition-all overflow-hidden shadow-2xl"
                            >
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] group-hover:bg-purple-600/20 transition-all" />
                                <div className="absolute top-8 right-10">
                                    <div className="px-5 py-2 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                        ELITE PAID
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mb-10 border border-purple-500/20 group-hover:-rotate-6 transition-transform">
                                        <User className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 text-white">Human-AI Strategic Partner</h3>
                                    <p className="text-purple-100/60 dark:text-slate-400 leading-relaxed mb-10 text-lg font-medium">
                                        High-access mentorship with human global strategists.
                                        Includes visa guarantee and custom application roadmaps.
                                    </p>
                                    <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                        Initialize Paid Session <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 1: UPLOAD */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <button
                            onClick={() => setStep(0)}
                            className="mb-8 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> Change Guidance Path
                        </button>

                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter font-outfit uppercase">
                                Deep Data <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Feed</span>
                            </h1>
                            <p className="text-slate-500 uppercase text-[10px] tracking-[0.3em] font-bold">
                                Sector: {mode === 'HUMAN' ? 'Human-AI Expert Liaison' : 'Neural Avatar Scanning'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group/upload cursor-pointer relative bg-slate-50 dark:bg-black/20">
                                <input
                                    type="file" multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    onChange={handleFileUpload}
                                />
                                <div className="w-24 h-24 bg-white dark:bg-slate-800/80 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover/upload:scale-110 group-hover/upload:rotate-6 transition-transform duration-500 shadow-xl border border-slate-200 dark:border-white/5">
                                    <Upload className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Upload Academic Payload</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm font-medium">
                                    Drag marksheets or transcripts to initialize neural mapping.
                                </p>
                            </div>

                            <AnimatePresence>
                                {documents.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-8 space-y-3"
                                    >
                                        {documents.map((doc, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                                                <FileText className="w-5 h-5 text-primary" />
                                                <span className="text-sm font-bold flex-1 truncate text-slate-700 dark:text-slate-300">{doc.name}</span>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() => runAnalysis(false)}
                                disabled={documents.length === 0 || isAnalyzing}
                                className={`w-full mt-10 py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-500 relative z-10 ${documents.length === 0
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                    : 'bg-primary text-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 border-none'
                                    }`}
                            >
                                {isAnalyzing ? <><Loader2 className="animate-spin" /> ANALYZING...</> : <>RUN DEEP ANALYSIS <Brain /></>}
                            </button>

                            {!isAnalyzing && documents.length === 0 && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => runAnalysis(true)}
                                        className="text-primary text-sm font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all cursor-pointer z-20 relative"
                                    >
                                        <Zap className="w-4 h-4" /> Skip and Deploy Instant Demo <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: TACTICAL COMMAND CENTER */}
                {step === 2 && profile && (
                    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[700px] mt-8 border border-slate-200 dark:border-white/10 rounded-[2.5rem] bg-white dark:bg-[#0a0f1d]/80 backdrop-blur-3xl overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.1)] dark:shadow-[0_0_150px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500 transition-colors">

                        {/* --- TOP HUD --- */}
                        <div className="flex items-center justify-between px-12 py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/30">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Guidance Vector</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white italic">{mode === 'HUMAN' ? 'HUMAN-AI HYBRID' : 'NEURAL AI AVATAR'}</span>
                                </div>
                                <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subject Identity</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{profile.personal.name || "UNIDENTIFIED"}</span>
                                </div>
                            </div>

                            <div className="hide-scrollbar overflow-x-auto flex bg-slate-100 dark:bg-black/50 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
                                {[
                                    { id: 'GLOBAL', label: 'GEO-TARGETS', icon: Globe },
                                    { id: 'CAREER', label: 'WORK VECTORS', icon: Briefcase },
                                    { id: 'MISSION', label: 'STRATEGIC STEPS', icon: Rocket }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveView(tab.id as any)}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${activeView === tab.id
                                            ? 'bg-primary text-black shadow-2xl shadow-primary/30 scale-105 border-none'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" /> {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* --- CONTENT AREA --- */}
                        <div className="flex-1 flex overflow-hidden">

                            {/* SIDEBAR: BIOMETRICS */}
                            <div className="w-80 border-r border-white/5 p-8 flex flex-col gap-10 bg-black/20 shrink-0">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Aptitude Mapping</h4>
                                    <div className="h-52 w-full flex items-center justify-center -ml-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={profile.subjectStrength}>
                                                <PolarGrid stroke="#ffffff08" />
                                                <PolarAngleAxis
                                                    dataKey="subject"
                                                    tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }}
                                                />
                                                <Radar
                                                    name="User"
                                                    dataKey="score"
                                                    stroke="#0071e3"
                                                    fill="#0071e3"
                                                    fillOpacity={0.4}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Statistics</h4>
                                    <StatMini label="Predicted GPA" value={profile.educationHistory[0]?.score || "91%"} color="text-blue-400" />
                                    <StatMini label="Dominance" value={profile.educationHistory[0]?.stream || "STEM"} color="text-purple-400" />
                                    <StatMini label="Visa Rating" value="HIGH" color="text-green-400" />
                                </div>

                                {mode === 'HUMAN' && (
                                    <div className="mt-auto p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                                            <span className="text-[10px] font-black text-purple-400 uppercase">Expert Liaison Active</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic">"Strategy optimized by Dr. Marcus (Oxford Global Admissions)."</p>
                                    </div>
                                )}
                            </div>

                            {/* MAIN VIEWPORT */}
                            <div className="flex-1 p-12 overflow-y-auto relative bg-gradient-to-br from-transparent to-primary/5 scroll-smooth">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeView}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {activeView === 'GLOBAL' && (
                                            <div className="space-y-10">
                                                <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-slate-200 dark:border-white/10 pb-8 gap-4">
                                                    <h2 className="text-5xl font-black tracking-tighter uppercase font-outfit text-slate-900 dark:text-white">
                                                        Geo-Strategic <span className="text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Targets</span>
                                                    </h2>
                                                    <div className="bg-slate-100 dark:bg-black/60 px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center gap-5">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IELTS Tool</span>
                                                        <input type="range" min="5" max="9" step="0.5" value={ieltsSim} onChange={(e) => setIeltsSim(parseFloat(e.target.value))} className="w-32 accent-primary" />
                                                        <span className="font-black text-primary text-xl">{ieltsSim}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {globalOps.map((op, i) => (
                                                        <div key={i} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] relative group hover:border-primary/50 transition-all overflow-hidden shadow-sm dark:shadow-none">
                                                            <Globe className="absolute -top-10 -right-10 w-48 h-48 opacity-5 dark:opacity-5 group-hover:scale-125 transition-transform duration-700 text-slate-900 dark:text-white" />
                                                            <div className="relative z-10">
                                                                <div className="flex justify-between items-start mb-8">
                                                                    <span className="px-4 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase">{op.country}</span>
                                                                    <div className="text-3xl font-black text-slate-900 dark:text-white">{op.probability + (ieltsSim > 7 ? 5 : 0)}%</div>
                                                                </div>
                                                                <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">{op.university}</h3>
                                                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">{op.program}</p>
                                                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                                                                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cost: {op.tuition}</div>
                                                                    <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">ROI: VERY HIGH</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeView === 'CAREER' && (
                                            <div className="space-y-10">
                                                <h2 className="text-5xl font-black tracking-tighter border-b border-slate-200 dark:border-white/10 pb-8 uppercase font-outfit text-slate-900 dark:text-white">
                                                    Work <span className="text-purple-600 dark:text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">Vectors</span>
                                                </h2>
                                                <div className="space-y-6">
                                                    {careerPaths.map((path, i) => (
                                                        <div key={i} className="flex flex-col md:flex-row gap-10 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] hover:bg-slate-50 dark:hover:bg-black/40 transition-all group shadow-sm dark:shadow-none">
                                                            <div className="w-24 h-24 rounded-3xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                                                                <Briefcase className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{path.title}</h3>
                                                                    <div className="text-right">
                                                                        <div className="text-[8px] font-black text-slate-400 uppercase">Outlook</div>
                                                                        <div className="text-green-600 dark:text-green-400 font-black tracking-widest text-lg">{path.jobOutlook}</div>
                                                                    </div>
                                                                </div>
                                                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-2xl font-medium">{path.description}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {path.skillsGap.map(s => (
                                                                        <span key={s} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{s}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeView === 'MISSION' && (
                                            <div className="max-w-4xl mx-auto space-y-16">
                                                <div className="text-center mb-10">
                                                    <h2 className="text-5xl font-black tracking-tighter uppercase font-outfit text-slate-900 dark:text-white">
                                                        Strategic <span className="text-primary drop-shadow-[0_0_10px_rgba(0,113,227,0.3)]">Sequence</span>
                                                    </h2>
                                                </div>
                                                <div className="relative px-4">
                                                    <div className="absolute left-[39px] md:left-[59px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary via-primary/30 to-transparent" />
                                                    <div className="space-y-14">
                                                        {timeline.map((step, i) => (
                                                            <div key={i} className="flex gap-8 md:gap-12 items-start relative z-10">
                                                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shrink-0 border-2 ${step.status === 'Completed' ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-500' :
                                                                    step.status === 'Active' ? 'bg-primary/20 border-primary text-primary animate-pulse' :
                                                                        'bg-white dark:bg-[#111827] border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-600'
                                                                    }`}>
                                                                    <span className="font-black text-lg md:text-xl italic">{step.month}</span>
                                                                </div>
                                                                <div className="flex-1 pt-2 md:pt-4">
                                                                    <h4 className={`text-xl md:text-2xl font-black mb-1 ${step.status === 'Active' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{step.title}</h4>
                                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-base">{step.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* RIGHT LOGS */}
                            <div className="w-80 border-l border-slate-100 dark:border-white/5 p-8 flex flex-col gap-8 bg-slate-50/50 dark:bg-black/20 shrink-0">
                                <div className="flex-1 flex flex-col min-h-0">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Neural Logs
                                    </h4>
                                    <div className="flex-1 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 font-mono text-[9px] text-cyan-600 dark:text-primary/80 overflow-y-auto space-y-3 custom-scrollbar">
                                        {aiLogs.map((log, i) => (
                                            <div key={i} className="flex gap-2 leading-tight">
                                                <span className="text-slate-400">[{i}]</span>
                                                <span>{log}</span>
                                            </div>
                                        ))}
                                        <div className="w-2 h-4 bg-primary animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Analysis</h4>
                                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 p-6 rounded-[2rem]">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase">Risk Level</span>
                                            <span className="text-[8px] font-black text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-400/10 px-2 py-0.5 rounded border border-red-200 dark:border-red-500/50">MODERATE</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {intelligence?.riskAnalysis.factors.map((f, i) => (
                                                <li key={i} className="text-[10px] text-red-700 dark:text-red-200/60 leading-tight font-medium">• {f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <button onClick={() => setStep(0)} className="w-full py-5 rounded-2xl border border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase tracking-[0.2em]">
                                    Terminate Session
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: PRICING GATEWAY */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto py-12"
                    >
                        <button
                            onClick={() => setStep(0)}
                            className="mb-12 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Selection
                        </button>

                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter font-outfit uppercase text-slate-900 dark:text-white transition-colors">
                                Upgrade Your <span className="text-purple-600 dark:text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Intelligence</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">Choose an elite tier to unlock human-led global strategy and mission roadmaps.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <PricingCard
                                title="Go" price="19" description="Keep chatting with expanded access"
                                features={["Explore topics in depth", "Longer chats", "More content upload"]}
                            />
                            <PricingCard
                                title="Plus" price="49" description="Unlock the full experience"
                                features={["Solve complex problems", "Priority access", "Agent mode active"]}
                                highlighted={true}
                                onProceed={() => runAnalysis(true)}
                            />
                            <PricingCard
                                title="Pro" price="149" description="Maximize your productivity"
                                features={["Master advanced tasks", "Unlimited storage", "Early access to labs"]}
                            />
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />

            <AnimatePresence>
                {showAssistant && (
                    <VoiceAssistant
                        onClose={() => setShowAssistant(false)}
                        onNewMessage={() => { }}
                        mode="avatar"
                        initialMessage={assistantMessage}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ... helper functions ...

function StatMini({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-xs font-black ${color}`}>{value}</span>
        </div>
    );
}

function PricingCard({
    title, price, description, features, highlighted = false, isCurrent = false, onProceed
}: {
    title: string, price: string, description: string, features: string[], highlighted?: boolean, isCurrent?: boolean, onProceed?: () => void
}) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-10 rounded-[2.5rem] border transition-all flex flex-col shadow-xl dark:shadow-none ${highlighted
                ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.1)] relative overflow-hidden'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
                }`}
        >
            {highlighted && (
                <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-purple-500 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                    Popular
                </div>
            )}

            <h3 className="text-2xl font-black mb-1 font-outfit uppercase text-slate-900 dark:text-white">{title}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl font-bold text-slate-400 dark:text-slate-500">$</span>
                <span className="text-5xl font-black font-outfit text-slate-900 dark:text-white">{price}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold ml-1">/ mo</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">{description}</p>

            <div className="space-y-4 mb-10 flex-1">
                {features.map((f, i) => (
                    <div key={i} className="flex gap-3 text-[11px] text-slate-700 dark:text-slate-300 font-bold">
                        <Star className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {f}
                    </div>
                ))}
            </div>

            <button
                onClick={onProceed}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all ${isCurrent
                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-default border border-slate-200 dark:border-white/10'
                    : highlighted
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] border-none'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 border-none'
                    }`}
            >
                {isCurrent ? 'Your Current Plan' : `Upgrade to ${title}`}
            </button>
        </motion.div>
    );
}
