
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, AlertTriangle, BookOpen, Clock, CheckCircle2, Circle } from 'lucide-react';

interface RoadmapData {
    goalOverview: string;
    requirements: {
        minPercentage12: number;
        mandatorySubjects: string[];
        minGPA?: string;
        backlogsAllowed: number;
    };
    exams: { name: string; score: string; mandatory: boolean }[];
    steps: { label: string; status: string }[];
    timeline: { year: string; desc: string }[];
    alternativePath: { title: string; reason: string };
}

interface RoadmapModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: RoadmapData;
    title: string;
}

export default function RoadmapModal({ isOpen, onClose, data, title }: RoadmapModalProps) {
    if (!data) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 md:inset-10 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto custom-scrollbar relative">

                            {/* Header */}
                            <div className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 p-6 z-10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Trophy className="text-yellow-400" />
                                        {title}
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">{data.goalOverview}</p>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">

                                {/* Section 2: Minimum Academic Requirements */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <BookOpen size={18} /> Minimum Requirements
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">12th Score</p>
                                            <p className="text-xl font-bold text-white">{data.requirements.minPercentage12}%</p>
                                        </div>
                                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Subjects</p>
                                            <p className="text-sm font-bold text-white line-clamp-1">{data.requirements.mandatorySubjects.join(", ") || "Any"}</p>
                                        </div>
                                        {data.requirements.minGPA && (
                                            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Min GPA</p>
                                                <p className="text-xl font-bold text-white">{data.requirements.minGPA}</p>
                                            </div>
                                        )}
                                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Backlogs</p>
                                            <p className="text-xl font-bold text-white">{data.requirements.backlogsAllowed}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Required Exams */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <CheckCircle2 size={18} /> Required Exams
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {data.exams.map((exam, i) => (
                                            <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${exam.mandatory ? 'bg-purple-500/10 border-purple-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                                                <div>
                                                    <p className="font-bold text-white">{exam.name}</p>
                                                    <p className="text-xs text-slate-400">{exam.mandatory ? 'Mandatory' : 'Optional'}</p>
                                                </div>
                                                <span className="text-sm font-mono font-bold text-slate-200">{exam.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 4: Vertical Step-by-Step Action Plan */}
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-6 flex items-center gap-2">
                                        <Clock size={18} /> Action Plan
                                    </h3>
                                    <div className="space-y-0 relative pl-4 border-l-2 border-slate-700 ml-2">
                                        {data.steps.map((step, i) => (
                                            <div key={i} className="mb-8 relative pl-6">
                                                {/* Indicator Dot */}
                                                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 
                                                    ${step.status === 'Completed' ? 'bg-green-500 border-green-500' :
                                                        step.status === 'In Progress' ? 'bg-yellow-500 border-yellow-500' : 'bg-slate-900 border-slate-500'}`}
                                                />

                                                <h4 className={`text-md font-bold ${step.status === 'Completed' ? 'text-green-400' : 'text-white'}`}>
                                                    Step {i + 1}: {step.label}
                                                </h4>
                                                <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-1 inline-block
                                                    ${step.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                                        step.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-500'}`}>
                                                    {step.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 5 & 6: Timeline & Alternative */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                                    <div>
                                        <h4 className="font-bold text-white mb-3">Expected Timeline</h4>
                                        <ul className="space-y-2 text-sm text-slate-300">
                                            {data.timeline.map((t, i) => (
                                                <li key={i} className="flex justify-between border-b border-slate-800 pb-2 last:border-0">
                                                    <span className="font-bold text-slate-400">{t.year}</span>
                                                    <span>{t.desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
                                        <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                            <AlertTriangle size={16} /> Not Eligible?
                                        </h4>
                                        <p className="text-sm text-slate-300 mb-4">
                                            If you don't meet the requirements for <b>{title}</b>:
                                        </p>
                                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Recommended Alternative</p>
                                            <p className="font-bold text-white">{data.alternativePath.title}</p>
                                            <p className="text-xs text-slate-400 mt-1">{data.alternativePath.reason}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
