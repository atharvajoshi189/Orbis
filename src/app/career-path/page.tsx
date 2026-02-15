"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, Loader2, Brain, Globe, Briefcase, ChevronRight, Zap, Target, ShieldCheck, TrendingUp } from 'lucide-react';
import { analyzeDocument, ExtractedData } from '@/lib/documentAnalyzer';
import { buildProfileFromDocuments, UnifiedProfile } from '@/lib/profileBuilder';
import { generateIntelligence, IntelligenceOutput } from '@/lib/globalEligibilityEngine';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerPathPage() {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [documents, setDocuments] = useState<File[]>([]);
    const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
    const [profile, setProfile] = useState<UnifiedProfile | null>(null);
    const [intelligence, setIntelligence] = useState<IntelligenceOutput | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            // 1. Extract Data
            const extractions = await Promise.all(documents.map(analyzeDocument));
            setExtractedData(extractions);

            // 2. Build Profile
            const userProfile = buildProfileFromDocuments(extractions);
            setProfile(userProfile);

            // 3. Generate Intelligence
            const intel = generateIntelligence(userProfile);
            setIntelligence(intel);

            setStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300">
            <Navbar />

            <main className="container-custom mx-auto pt-32 pb-12 px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                        Document-Driven Intelligence Engine
                    </h1>
                    <p className="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
                        Upload your academic history (Marksheets, Transcripts, Certificates) to unlock a personalized Global Career Strategy.
                    </p>
                </div>

                {step === 1 && (
                    <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-xl dark:shadow-none transition-all">

                        {/* Scanning Effect Overlay */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 z-50 bg-white/90 dark:bg-[#060a14]/90 flex flex-col items-center justify-center backdrop-blur-sm transition-colors">
                                <Loader2 className="w-16 h-16 text-cyan-500 dark:text-cyan-400 animate-spin mb-4" />
                                <div className="text-cyan-600 dark:text-cyan-300 font-black text-lg animate-pulse tracking-widest uppercase text-center px-4">ANALYZING DOCUMENTS...</div>
                                <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 font-black uppercase tracking-widest">Extracting grades, streams, and certifications</div>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center hover:border-cyan-500/50 hover:bg-cyan-500/5 transition group cursor-pointer relative bg-white/40 dark:bg-black/20">
                            <input
                                type="file"
                                multiple
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={handleFileUpload}
                            />
                            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                                <Upload className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Drop Academic Documents</h3>
                            <p className="text-slate-600 dark:text-slate-400">10th, 12th, Bachelor's, Transcripts, Certificates</p>
                        </div>

                        {documents.length > 0 && (
                            <div className="mt-8 space-y-3">
                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Queue ({documents.length})</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {documents.map((doc, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10">
                                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">{doc.name}</span>
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={runAnalysis}
                            disabled={documents.length === 0 || isAnalyzing}
                            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${documents.length === 0
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-cyan-500/40 hover:scale-[1.01]'
                                }`}
                        >
                            Generate Global Strategy <Brain className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {step === 2 && intelligence && profile && (
                    <div className="animate-fade-in-up space-y-8">

                        {/* 1. AI Insight Panel */}
                        <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/40 dark:to-blue-900/40 border border-purple-200 dark:border-purple-500/30 p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600" />
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-600/10 rounded-xl">
                                    <Brain className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Strategic Assessment</h2>
                                    <p className="text-slate-700 dark:text-purple-100/80 leading-relaxed text-lg font-medium">{intelligence.aiInsight}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Profile Summary Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl relative shadow-sm backdrop-blur-xl">
                                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4" /> Detected Profile
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-slate-500">GPA / Aggregate</div>
                                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{profile.gpa} <span className="text-sm text-slate-400 font-normal">/ 10.0</span></div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-500">Dominant Stream</div>
                                            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{intelligence.academicSummary.dominantStream}</div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                            <div className="text-xs text-slate-500 uppercase mb-2">Subject Strengths</div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.subjectStrength.map((sub, i) => (
                                                    <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700">
                                                        {sub.subject} <span className="text-green-600 dark:text-green-400">{sub.score}%</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {profile.certifications.length > 0 && (
                                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                                <div className="text-xs text-slate-500 uppercase mb-2">Certifications</div>
                                                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                                    {profile.certifications.map((c, i) => <li key={i}>• {c}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Risk Analysis */}
                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl relative shadow-sm backdrop-blur-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> Risk Analysis
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${intelligence.riskAnalysis.level === 'Low' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'}`}>
                                            {intelligence.riskAnalysis.level} Risk
                                        </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {intelligence.riskAnalysis.factors.map((f, i) => (
                                            <li key={i} className="text-sm text-red-600 dark:text-red-300 flex items-start gap-2">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                                                {f}
                                            </li>
                                        ))}
                                        {intelligence.riskAnalysis.factors.length === 0 && (
                                            <li className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> No critical risks detected.
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* 3. Pathways (Tabs) */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Global Opportunities
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {intelligence.globalPaths.map((path, i) => (
                                        <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-cyan-500/30 transition group relative overflow-hidden shadow-sm backdrop-blur-xl">
                                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                                <TrendingUp className="w-12 h-12 text-slate-100 dark:text-slate-800 group-hover:text-cyan-100 dark:group-hover:text-cyan-900/50 transition" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{path.country}</div>
                                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">
                                                        ROI: {path.roi}
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">{path.title}</h4>

                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Cost</div>
                                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{path.cost}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Duration</div>
                                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{path.duration}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Visa Chance</div>
                                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{intelligence.visaConfidence[path.country] || 80}%</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Avg Salary</div>
                                                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{intelligence.roiForecast[path.country] || "$??"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-xl font-bold flex items-center gap-2 mt-8 text-slate-900 dark:text-white">
                                    <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" /> Professional Trajectories
                                </h3>

                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
                                    <div className="flex flex-wrap gap-3">
                                        {intelligence.careerRoles.map((role, i) => (
                                            <div key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 transition cursor-default text-sm text-slate-700 dark:text-slate-200 font-medium">
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <button onClick={() => setStep(1)} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
                                        Upload More Documents
                                    </button>
                                    <button className="px-6 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-cyan-600 dark:hover:bg-cyan-400 hover:text-white dark:hover:text-black transition shadow-lg shadow-cyan-500/20">
                                        Download Strategy Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
