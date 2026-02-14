"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const planets = [
    { name: "Stanford", distance: 160, size: 40, color: "bg-red-500", label: "Ambitious", duration: 25 },
    { name: "MIT", distance: 230, size: 35, color: "bg-red-700", label: "Target", duration: 35 },
    { name: "Oxford", distance: 300, size: 38, color: "bg-blue-600", label: "Safe", duration: 45 },
    { name: "Harvard", distance: 370, size: 42, color: "bg-crimson", label: "Ambitious", duration: 55 },
];

export default function SolarSystem() {
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Sun / Core */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-gold to-orange-500 p-1 shadow-[0_0_80px_rgba(255,215,0,0.4)] animate-pulse-slow">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-4xl">🧑‍🚀</span>
                </div>
            </div>

            {/* Orbits & Planets */}
            {planets.map((planet, index) => (
                <div key={planet.name} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Orbit Ring */}
                    <div
                        className="absolute rounded-full border border-white/5"
                        style={{
                            width: planet.distance * 2,
                            height: planet.distance * 2,
                            borderStyle: index % 2 === 0 ? "solid" : "dashed",
                            opacity: 0.3
                        }}
                    />

                    {/* Rotating Container */}
                    <motion.div
                        className="absolute w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: planet.duration, repeat: Infinity, ease: "linear" }}
                    >
                        {/* Planet Node */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{ transform: `translateX(${planet.distance}px)` }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                className={`
                            relative w-10 h-10 rounded-full glass border border-white/20 
                            flex items-center justify-center cursor-pointer pointer-events-auto
                            shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)]
                            transition-all duration-300
                        `}
                                onMouseEnter={() => setHoveredPlanet(planet.name)}
                                onMouseLeave={() => setHoveredPlanet(null)}
                            >
                                {/* Planet Inner Core */}
                                <div className={`w-3 h-3 rounded-full ${planet.color}`} />

                                {/* Glass Reflection */}
                                <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/40 rounded-full blur-[1px]" />

                                {/* Tooltip on Hover */}
                                {hoveredPlanet === planet.name && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, rotate: -360 }} // Counter-rotate to keep text upright logic needed if parent rotates, but here we just show/hide
                                        animate={{ opacity: 1, y: -50 }}
                                        className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 orbis-card min-w-[120px] text-center z-50 pointer-events-none"
                                    >
                                        <p className="neon-text text-sm font-bold">{planet.name}</p>
                                        <p className="text-xs text-gold">ROI: 98%</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            ))}

            {/* Decorative Stars/Dust */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
        </div>
    );
}
