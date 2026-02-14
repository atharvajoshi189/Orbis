
import { useState } from 'react';
import { Check, X, AlertTriangle, ArrowRight } from 'lucide-react';
import RoadmapModal from './RoadmapModal';

interface EligibilityCardProps {
    careerName: string;
    isEligible: boolean;
    reasons: string[];
    admissionProbability: number;
    roi: string;
    visaProbability?: number;
    riskLevel: string;
    roadmap?: any; // New prop for roadmap data
}

export default function EligibilityCard({
    careerName,
    isEligible,
    reasons,
    admissionProbability,
    roi,
    visaProbability,
    riskLevel,
    roadmap
}: EligibilityCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={`relative p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${isEligible ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>

                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 -z-10 ${isEligible ? 'bg-green-400' : 'bg-red-400'}`} />

                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">{careerName}</h3>
                        <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isEligible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {isEligible ? 'Eligible' : 'Not Eligible'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700/50 text-slate-300">
                                ROI: {roi}
                            </span>
                        </div>
                    </div>
                    <div className={`p-2 rounded-full ${isEligible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isEligible ? <Check size={20} /> : <X size={20} />}
                    </div>
                </div>

                {reasons.length > 0 && (
                    <div className="mb-4 space-y-1">
                        {reasons.map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-red-300">
                                <AlertTriangle size={12} />
                                <span>{reason}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase">Admission Chance</p>
                        <div className="flex items-end gap-1">
                            <span className={`text-lg font-bold ${admissionProbability > 70 ? 'text-green-400' : 'text-yellow-400'}`}>{admissionProbability}%</span>
                        </div>
                    </div>
                    {visaProbability !== undefined && (
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase">Visa Chance</p>
                            <span className="text-lg font-bold text-purple-400">{visaProbability}%</span>
                        </div>
                    )}
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs text-cyan-400 flex items-center gap-1 hover:text-cyan-300 transition"
                    >
                        View Roadmap <ArrowRight size={12} />
                    </button>
                </div>

            </div>

            {/* Roadmap Modal */}
            <RoadmapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={careerName}
                data={roadmap}
            />
        </>
    );
}
