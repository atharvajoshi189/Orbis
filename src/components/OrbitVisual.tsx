"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const universities = [
    { name: "Stanford", color: "#8C1515", size: 60, distance: 140, duration: 25 },
    { name: "MIT", color: "#A31F34", size: 50, distance: 200, duration: 35 },
    { name: "Oxford", color: "#002147", size: 55, distance: 260, duration: 40 },
    { name: "Harvard", color: "#A51C30", size: 65, distance: 320, duration: 50 },
];

export default function OrbitVisual() {
    const [hoveredUni, setHoveredUni] = useState<string | null>(null);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Central Core (Student/Orbis) */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-gold to-electric-blue p-1 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                <div className="w-full h-full rounded-full bg-deep-charcoal flex items-center justify-center">
                    <span className="text-3xl">🧑‍🎓</span>
                </div>
            </div>

            {/* Orbits & Planets */}
            {universities.map((uni, i) => (
                <div
                    key={uni.name}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    {/* Orbit Path (dashed line) */}
                    <div
                        className="absolute rounded-full border border-white/5"
                        style={{
                            width: uni.distance * 2,
                            height: uni.distance * 2,
                        }}
                    />

                    {/* Planet Container - Rotates */}
                    <motion.div
                        className="absolute w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: uni.duration,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {/* Planet Itself (offset by distance) */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{ transform: `translateX(${uni.distance}px)` }}
                        >
                            <motion.div
                                className="rounded-full shadow-lg cursor-pointer pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform duration-300 relative group"
                                style={{ width: uni.size, height: uni.size, background: uni.color }}
                                onMouseEnter={() => setHoveredUni(uni.name)}
                                onMouseLeave={() => setHoveredUni(null)}
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            ))}

            {hoveredUni && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-10 px-6 py-2 glass-card rounded-full text-white text-lg font-bold z-20"
                >
                    {hoveredUni}
                </motion.div>
            )}
        </div>
    );
}
