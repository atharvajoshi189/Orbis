import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, TrendingUp, Globe, Building2, Rocket, ArrowRight, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutOrbisProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutOrbis({ isOpen, onClose }: AboutOrbisProps) {
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
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Slide-in Panel */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[101] h-screen bg-slate-900/95 shadow-[0_-10px_40px_-5px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/5 backdrop-blur-xl shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center">
                                    <Orbit className="w-7 h-7 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold font-mono tracking-[0.2em] text-white relative">
                                        ORBIS
                                        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
                                    </h2>
                                    <p className="text-xs text-cyan-400 font-medium tracking-widest uppercase mt-1">
                                        Strategic Intelligence
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-white/10 hover:text-white text-slate-400 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 md:p-12 space-y-16">

                            {/* Main Description */}
                            <section className="max-w-4xl mx-auto text-center space-y-6">
                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                                    Orbis is an <span className="text-cyan-400 font-semibold">AI-powered career strategy engine</span> designed to help students make data-driven decisions about their future. We combine artificial intelligence, financial modeling, global job market analytics, and structured risk analysis to transform how students choose universities, evaluate ROI, and plan long-term success.
                                </p>
                            </section>

                            {/* Mission & Vision Grid */}
                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all hover:bg-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <div className="h-1 w-6 bg-cyan-500 rounded-full" />
                                        Our Mission
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        To replace guesswork in career decisions with structured intelligence, transparency, and measurable outcomes.
                                    </p>
                                </div>
                                <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <div className="h-1 w-6 bg-purple-500 rounded-full" />
                                        Our Vision
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        To become the global command center for student career strategy — where education, finance, and opportunity intersect.
                                    </p>
                                </div>
                            </div>

                            {/* Core Capabilities */}
                            <section className="max-w-6xl mx-auto">
                                <h3 className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Core Capabilities</h3>
                                <div className="grid md:grid-cols-4 gap-4">
                                    {[
                                        { title: "AI Career Intelligence", icon: Cpu, desc: "Predictive modeling for career paths and success probabilities." },
                                        { title: "ROI & Loan Simulation", icon: TrendingUp, desc: "Financial forecasting to calculate education return on investment." },
                                        { title: "Global Market Signals", icon: Globe, desc: "Real-time analysis of international job market trends." },
                                        { title: "Government Path Analysis", icon: Building2, desc: "Verified data on public sector opportunities and requirements." }
                                    ].map((item, i) => (
                                        <div key={i} className="group p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                                            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Founder's Note */}
                            <section className="max-w-3xl mx-auto">
                                <div className="relative p-8 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[100px] rounded-full pointing-events-none" />

                                    <h3 className="relative z-10 text-lg font-serif italic text-cyan-400 mb-4">Founder's Note</h3>
                                    <p className="relative z-10 text-xl text-slate-200 font-light leading-relaxed mb-6">
                                        "Orbis was built to empower students with clarity in a world full of noise. Our goal is not just to guide, but to equip individuals with the tools to evaluate risk, measure opportunity, and act strategically."
                                    </p>
                                    <div className="relative z-10 flex items-center gap-3 opacity-70">
                                        <div className="h-px w-12 bg-slate-600" />
                                        <span className="text-xs uppercase tracking-widest text-slate-500">Orbis Leadership</span>
                                    </div>
                                </div>
                            </section>

                            {/* CTA */}
                            <section className="py-12 text-center pb-24">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
                                    Ready to Take Control of Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Career Strategy?</span>
                                </h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button
                                        size="lg"
                                        className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 h-12 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]"
                                        onClick={onClose}
                                    >
                                        Launch Command Center
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 h-12"
                                        onClick={() => window.location.href = '/guidance'}
                                    >
                                        Start Analysis
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </section>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
