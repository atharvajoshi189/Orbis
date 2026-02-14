
export default function PathGraph() {
    return (
        <div className="relative w-full h-[300px] bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex items-center justify-center overflow-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

            {/* Nodes */}
            <div className="flex items-center gap-8 relative z-10">

                {/* Node 1 */}
                <div className="flex flex-col items-center gap-2 relative group">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 font-bold z-10">10th</div>
                    <span className="text-xs text-slate-500">Foundation</span>
                    {/* Line */}
                    <div className="absolute left-full top-6 w-8 h-0.5 bg-green-500/50"></div>
                </div>

                {/* Node 2 */}
                <div className="flex flex-col items-center gap-2 relative group">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border-2 border-green-500 flex items-center justify-center text-green-400 font-bold z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">12th</div>
                    <span className="text-xs text-slate-500">Science</span>
                    {/* Line */}
                    <div className="absolute left-full top-6 w-8 h-0.5 bg-green-500/50"></div>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col items-center gap-2 relative group">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border-2 border-green-500 flex items-center justify-center text-green-400 font-bold z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">B.Tech</div>
                    <span className="text-xs text-slate-500">Undergrad</span>
                    {/* Line */}
                    <div className="absolute left-full top-6 w-8 h-0.5 bg-slate-700"></div>
                </div>

                {/* Node 4 (Target) */}
                <div className="flex flex-col items-center gap-2 relative group">
                    <div className="w-14 h-14 rounded-full bg-cyan-950/50 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold z-10 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-pulse">AI Eng.</div>
                    <span className="text-xs text-cyan-400 font-bold">Target</span>
                </div>

            </div>

            <div className="absolute bottom-4 right-4 text-xs text-slate-600">
                *Visual representation of currently selected path
            </div>

        </div>
    );
}
