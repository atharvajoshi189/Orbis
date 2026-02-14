"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, Loader2, Brain, Globe, Briefcase, ChevronRight } from 'lucide-react';
import { analyzeDocument, ExtractedData } from '@/lib/documentAnalyzer';
import { buildProfileFromDocuments, UnifiedProfile } from '@/lib/profileBuilder';
import { evaluateGlobalOptions, GlobalOpportunity } from '@/lib/globalEligibilityEngine';
import { generateCareerMap, CareerPath } from '@/lib/careerMappingEngine';

export default function GuidancePage() {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [documents, setDocuments] = useState<File[]>([]);
    const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
    const [profile, setProfile] = useState<UnifiedProfile | null>(null);
    const [globalOps, setGlobalOps] = useState<GlobalOpportunity[]>([]);
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments([...documents, ...Array.from(e.target.files)]);
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

            // 3. Generate Insights
            setGlobalOps(evaluateGlobalOptions(userProfile));
            setCareerPaths(generateCareerMap(userProfile));

            setStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-cyan-500/30">
            <Navbar />

            <main className="container-custom mx-auto py-12 px-4">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Deep Profile Analysis
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Upload your academic documents (Marksheets, Certificates) and let our AI build a comprehensive career roadmap for you.
                    </p>
                </div>

                {step === 1 && (
                    <div className="max-w-2xl mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-cyan-500/50 hover:bg-cyan-500/5 transition group cursor-pointer relative">
                            <input
                                type="file"
                                multiple
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                            />
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                                <Upload className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Upload Marksheets</h3>
                            <p className="text-sm text-slate-500">Drag & drop or click to upload PDF/JPG</p>
                        </div>

                        {documents.length > 0 && (
                            <div className="mt-8 space-y-3">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Attached Documents</h4>
                                {documents.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm text-slate-300 flex-1 truncate">{doc.name}</span>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={runAnalysis}
                            disabled={documents.length === 0 || isAnalyzing}
                            className={`w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${documents.length === 0
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="animate-spin" /> Analyzing Documents...
                                </>
                            ) : (
                                <>
                                    Run Deep Analysis <Brain className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 2 && profile && (
                    <div className="space-y-12 animate-fade-in-up">

                        {/* 1. Profile Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Class 12th Performance</h3>
                                <div className="text-4xl font-bold text-white mb-1">{profile.academic.class12.score}%</div>
                                <div className="text-sm text-cyan-400 font-medium">Top 5% National</div>
                            </div>
                            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Strongest Subject</h3>
                                <div className="text-4xl font-bold text-white mb-1">Math</div>
                                <div className="text-sm text-green-400 font-medium">95/100 Score</div>
                            </div>
                            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Predicted Stream</h3>
                                <div className="text-4xl font-bold text-white mb-1">CS / AI</div>
                                <div className="text-sm text-purple-400 font-medium">High Aptitude</div>
                            </div>
                        </div>

                        {/* 2. Global Opportunities */}
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                                <Globe className="text-blue-400" /> Global Eligibility Matches
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {globalOps.map((op, i) => (
                                    <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition">{op.university}</h3>
                                                <p className="text-sm text-slate-400">{op.country}</p>
                                            </div>
                                            <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded">{op.probability}% Chance</span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-slate-300"><span className="text-slate-500">Program:</span> {op.program}</p>
                                            <p className="text-sm text-slate-300"><span className="text-slate-500">Tuition:</span> {op.tuition}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {op.requirements.map(req => (
                                                <span key={req} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">{req}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Career Roadmap */}
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                                <Briefcase className="text-purple-400" /> Career Trajectories
                            </h2>
                            <div className="space-y-4">
                                {careerPaths.map((path, i) => (
                                    <div key={i} className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-bold text-white">{path.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${path.matchScore > 90 ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                        {path.matchScore}% Match
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm max-w-2xl">{path.description}</p>
                                            </div>
                                            <div className="text-right space-y-1 min-w-[150px]">
                                                <div className="text-slate-500 text-xs font-bold uppercase">Salary Potential</div>
                                                <div className="text-lg font-bold text-white">{path.salaryRange}</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Why this fits you</h4>
                                                <ul className="space-y-1">
                                                    {path.reasoning.map(r => (
                                                        <li key={r} className="text-sm text-slate-300 flex items-center gap-2">
                                                            <CheckCircle className="w-3 h-3 text-green-500" /> {r}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Skills to Acquire</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {path.skillsGap.map(s => (
                                                        <span key={s} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-end justify-end">
                                                <button className="text-cyan-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                                    View Detailed Roadmap <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}

