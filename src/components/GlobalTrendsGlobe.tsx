"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
    const earthRef = useRef<THREE.Mesh>(null);
    const [hoveredData, setHoveredData] = useState<string | null>(null);

    // Auto-rotation
    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0005;
        }
    });

    // Trend Data Points (Lat, Lon, Label, Value)
    const trends = useMemo(() => [
        { lat: 40.7128, lon: -74.0060, label: "USA: Tech Jobs", value: "+12%" }, // NY
        { lat: 51.5074, lon: -0.1278, label: "UK: Finance", value: "Stable" }, // London
        { lat: 12.9716, lon: 77.5946, label: "India: Startups", value: "Booming" }, // Bangalore
        { lat: 35.6762, lon: 139.6503, label: "Japan: Robotics", value: "High Demand" }, // Tokyo
        { lat: 52.5200, lon: 13.4050, label: "Germany: Engineering", value: "Visa Open" }, // Berlin
        { lat: -33.8688, lon: 151.2093, label: "Australia: Healthcare", value: "Critical Shortage" }, // Sydney
    ], []);

    // Convert Lat/Lon to 3D Position
    const radius = 2; // Earth radius
    const getPosition = (lat: number, lon: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return [x, y, z] as [number, number, number];
    };

    return (
        <group>
            {/* Earth Sphere */}
            <Sphere args={[radius, 64, 64]} ref={earthRef}>
                <meshStandardMaterial
                    color="#1e3a8a" // Ocean Blue
                    emissive="#111827"
                    emissiveIntensity={0.2}
                    roughness={0.7}
                    metalness={0.1}
                    wireframe={false}
                />
            </Sphere>

            {/* Wireframe Overlay for "Tech" look */}
            <Sphere args={[radius + 0.02, 32, 32]}>
                <meshBasicMaterial
                    color="#3b82f6"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            {/* Data Markers */}
            <group rotation={[0, 0, 0]}> {/* If we want markers to rotate with earth, put them inside the earthRef group or sync rotation. For now, floating static markers relative to space or rotating? Let's make them rotate WITH earth for realism or static for readability? Rotating with earth is better. */}
            </group>

            {/* Actually, let's just make markers children of the Earth mesh so they rotate automatically if we attached them there. 
          But `Sphere` children might behave oddly if not grouped correctly. 
          Let's verify logic: modify the useFrame to rotate a Group containing both earth and markers.
      */}
        </group>
    );
}

function GlobeScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
    });

    const radius = 2.2;
    const trends = [
        { lat: 40.7128, lon: -74.0060, label: "USA", sub: "Tech Demand: High" },
        { lat: 51.5074, lon: -0.1278, label: "UK", sub: "Visa: Strict" },
        { lat: 12.9716, lon: 77.5946, label: "India", sub: "Export: Booming" },
        { lat: 35.6762, lon: 139.6503, label: "Japan", sub: "Labor: Shortage" },
        { lat: 52.5200, lon: 13.4050, label: "Germany", sub: "Eng: Hiring" },
        { lat: -33.8688, lon: 151.2093, label: "Aus", sub: "Residency: Easy" },
    ];

    const getPosition = (lat: number, lon: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    };

    return (
        <group ref={groupRef}>
            <Sphere args={[2, 64, 64]}>
                <meshPhysicalMaterial
                    color="#0f172a" // Dark slate ocean
                    // emissive="#1e293b"
                    roughness={0.6}
                    metalness={0.2}
                />
            </Sphere>
            {/* Continent approximation / Wireframe */}
            <Sphere args={[2.01, 32, 32]}>
                <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.1} />
            </Sphere>

            {/* Markers */}
            {trends.map((t, i) => {
                const pos = getPosition(t.lat, t.lon);
                return (
                    <group key={i} position={pos}>
                        <mesh>
                            <sphereGeometry args={[0.08, 16, 16]} />
                            <meshBasicMaterial color="#ef4444" toneMapped={false} />
                        </mesh>
                        <Html distanceFactor={15}>
                            <div className="bg-black/80 backdrop-blur-md border border-slate-700 p-2 rounded-lg text-xs w-24 text-center pointer-events-none select-none">
                                <div className="font-bold text-white">{t.label}</div>
                                <div className="text-blue-400 text-[10px]">{t.sub}</div>
                            </div>
                        </Html>
                    </group>
                )
            })}
        </group>
    )
}

export default function GlobalTrendsGlobe() {
    return (
        <div className="w-full h-full min-h-[500px] relative bg-slate-950">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <GlobeScene />
            </Canvas>
            <div className="absolute bottom-4 left-4 text-slate-500 text-xs font-mono">
                Interaction: Drag to Rotate | Scroll to Zoom
            </div>
        </div>
    );
}
