"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { ACCURATE_WORLD_MAP } from "./world-map-data";

// Detailed World Map Paths (Imported for accuracy)
const WORLD_PATHS = ACCURATE_WORLD_MAP;

// Placeholder for reference, now using WORLD_PATHS
const DETAILED_MAP_PATH_REF = "M156.4,85.6...";

// Let's use a "Dotted Map" approach using SVG circles that form the continents.
// This matches the "Dark Tech" theme perfectly and is easy to render without massive path data.


// Use a high-quality SVG Map Component instead of manual paths if possible.
// Since I can't easily include a 50KB SVG path string here without clutter, 
// I will use a reliable pattern: An SVG image or a simplified abstract dot map.
// Let's use an abstract "Dot Grid" map generator for a tech feel.

export default function WorldMap({ onPinClick }: { onPinClick?: (location: any) => void }) {

    // Locations: { id, x (%), y (%), label }
    const locations = [
        { id: "usa", x: 22, y: 35, label: "USA" }, // NY/East Coast
        { id: "uk", x: 46, y: 28, label: "London" },
        { id: "de", x: 50, y: 30, label: "Berlin" },
        { id: "in", x: 68, y: 45, label: "Mumbai" },
        { id: "cn", x: 75, y: 38, label: "Shanghai" },
        { id: "jp", x: 82, y: 38, label: "Tokyo" },
        { id: "au", x: 80, y: 75, label: "Sydney" },
        { id: "ca", x: 20, y: 25, label: "Toronto" },
        { id: "br", x: 30, y: 65, label: "Sao Paulo" },
    ];

    // Connections (lines between pins)
    const connections = [
        ["usa", "uk"],
        ["usa", "de"],
        ["uk", "in"],
        ["de", "in"],
        ["in", "jp"],
        ["in", "au"],
        ["jp", "usa"], // Trans-pacific
        ["usa", "br"],
    ];

    return (
        <div className="relative w-full aspect-[2/1] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

            {/* World Map SVG (Dotted/Pixelated Style via Mask) */}
            <div className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none p-8 flex items-center justify-center">
                <svg viewBox="0 0 1009 650" className="w-full h-full">
                    <defs>
                        {/* 1. Define the Dot Pattern */}
                        <pattern id="dot-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="6" height="6" className="fill-blue-500/80" rx="1" ry="1" />
                        </pattern>

                        {/* 2. Define the Continent Mask */}
                        <mask id="world-mask">
                            <rect width="100%" height="100%" fill="black" />
                            {WORLD_PATHS.map((path, i) => (
                                <path key={path.name + i} d={path.d} fill="white" />
                            ))}
                        </mask>

                        {/* 3. Define Glow Gradient for active areas (optional, for visual flair) */}
                        <radialGradient id="glow-radial" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </radialGradient>
                    </defs>

                    {/* 4. Render the Dot Grid masked by Continents */}
                    <rect width="100%" height="100%" fill="url(#dot-pattern)" mask="url(#world-mask)" className="filter drop-shadow-[0_0_2px_rgba(59,130,246,0.5)]" />

                    {/* Optional: Add a subtle overlay of the paths for edge definition */}
                    {/* {WORLD_PATHS.map((path) => (
                        <path key={path.name} d={path.d} className="fill-none stroke-blue-500/10 stroke-[0.5]" />
                    ))} */}
                </svg>
            </div>

            {/* Connection Lines via SVG overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {connections.map(([startId, endId], i) => {
                    const start = locations.find(l => l.id === startId);
                    const end = locations.find(l => l.id === endId);
                    if (!start || !end) return null;

                    return (
                        <motion.line
                            key={i}
                            x1={`${start.x}%`}
                            y1={`${start.y}%`}
                            x2={`${end.x}%`}
                            y2={`${end.y}%`}
                            stroke="url(#gradient-line)"
                            strokeWidth="1"
                            strokeOpacity="0.4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                        />
                    );
                })}
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Pins */}
            {locations.map((loc) => (
                <div
                    key={loc.id}
                    className="absolute z-20"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                    <div className="relative group cursor-pointer" onClick={() => onPinClick?.(loc)}>
                        {/* Pulse Ring */}
                        <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping opacity-75" />
                        {/* Core Dot */}
                        <div className="relative h-2 w-2 rounded-full bg-blue-400 border border-blue-200 shadow-[0_0_10px_#3b82f6]" />

                        {/* Label (Visible on hover) */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[10px] text-white px-2 py-1 rounded border border-blue-500/30 whitespace-nowrap pointer-events-none">
                            {loc.label}
                        </div>
                    </div>
                </div>
            ))}

            {/* Title / Legend */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-xs shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span className="text-slate-300">Active Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-0.5 w-4 bg-blue-500/50"></span>
                    <span className="text-slate-300">Data Pipeline</span>
                </div>
            </div>

        </div>
    );
}
