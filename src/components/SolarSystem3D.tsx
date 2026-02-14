"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Line, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

// --- Types ---
interface PlanetProps {
    radius: number;
    speed: number;
    angle: number;
    color: string;
    label: string;
    flag: string;
    yOffset: number;
    onHover: (pos: THREE.Vector3 | null, label: string | null) => void;
}

// --- Components ---

import { useAppStore } from "@/lib/store";

// ... (Types remain same)

function Core({ theme }: { theme: 'dark' | 'light' }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    const color = theme === 'dark' ? "#0ea5e9" : "#0284c7"; // Sky-500 vs Sky-600

    return (
        <group>
            {/* Wireframe Core */}
            <Sphere args={[1.5, 32, 32]} ref={meshRef}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={theme === 'dark' ? 2 : 1}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>
            {/* Inner Glow Core */}
            <Sphere args={[1.2, 32, 32]}>
                <meshBasicMaterial color={color} transparent opacity={0.5} />
            </Sphere>
            {/* Point Cloud Effect (Simulated Gaussian Splat density) */}
            <points>
                <sphereGeometry args={[1.8, 64, 64]} />
                <pointsMaterial color={theme === 'dark' ? "#00f3ff" : "#0ea5e9"} size={0.02} transparent opacity={0.6} sizeAttenuation />
            </points>
        </group>
    );
}

// ... (imports)

// ... (Core component)

// Renamed to OrbitRing to fix HMR hook order error
// ... (imports)

// Renamed to OrbitRing to fix HMR hook order error
function OrbitRing({ radius, angle, theme, speed = 0.05 }: { radius: number, angle: number, theme: 'dark' | 'light', speed?: number }) {
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            pts.push(new THREE.Vector3(x, 0, z));
        }
        return pts;
    }, [radius]);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * speed;
        }
    });

    return (
        <group rotation={[angle, 0, 0]}>
            <group ref={groupRef}>
                <Line points={points} color={theme === 'dark' ? "white" : "#334155"} transparent opacity={0.4} lineWidth={1} />
            </group>
        </group>
    );
}

function Meteor({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const { startPos, velocity, color } = useMemo(() => {
        // Spawn in a wider area, often outside the camera view initially
        const x = (Math.random() - 0.5) * 120;
        const y = (Math.random() - 0.5) * 80 + 30; // Higher up mostly
        const z = (Math.random() - 0.5) * 60 - 20; // Background depth mostly
        const start = new THREE.Vector3(x, y, z);

        // Random directory: mostly diagonal/across
        // We want them to streak across the screen, not just fall
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 40; // Very fast
        const vel = new THREE.Vector3(
            Math.cos(angle) * speed,
            -(Math.random() * 20 + 10), // Always some downward drift
            Math.sin(angle) * speed * 0.5
        );

        // Randomize color slightly (White, Cyan, faint Purple)
        const colors = ["#ffffff", "#a5f3fc", "#e9d5ff"];
        const c = colors[Math.floor(Math.random() * colors.length)];

        return { startPos: start, velocity: vel, color: new THREE.Color(c) };
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.position.add(velocity.clone().multiplyScalar(delta));

            // Fade out or kill if too far
            if (meshRef.current.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 150) {
                onComplete();
            }
        }
    });

    return (
        <Trail width={2} length={12} color={color} attenuation={(t) => t * t * 0.5}>
            <mesh ref={meshRef} position={startPos}>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.8} />
            </mesh>
        </Trail>
    );
}

function MeteorSystem() {
    // Manage multiple shooting stars
    const [meteors, setMeteors] = useState<{ id: number }[]>([]);

    useFrame((state) => {
        // Randomly spawn a star (approx 1% chance per frame => ~0.6 stars per second at 60fps)
        if (Math.random() < 0.015) {
            const id = Date.now() + Math.random();
            setMeteors(prev => [...prev, { id }]);
        }
    });

    const removeMeteor = (id: number) => {
        setMeteors(prev => prev.filter(m => m.id !== id));
    };

    return (
        <group>
            {meteors.map(meteor => (
                <Meteor key={meteor.id} onComplete={() => removeMeteor(meteor.id)} />
            ))}
        </group>
    );
}

export default function SolarSystem3D() {
    const [hoverTarget, setHoverTarget] = useState<THREE.Vector3 | null>(null);
    const { theme } = useAppStore();

    return (
        <div className="w-full h-[600px] relative">
            <Canvas camera={{ position: [0, 8, 32], fov: 45 }}>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
                <ambientLight intensity={theme === 'dark' ? 0.2 : 0.8} />
                <pointLight position={[0, 0, 0]} intensity={2} color={theme === 'dark' ? "#00f3ff" : "#0284c7"} distance={20} />

                <Core theme={theme} />

                <OrbitRing radius={4} angle={0.2} theme={theme} speed={0.2} />
                <OrbitRing radius={6} angle={-0.1} theme={theme} speed={-0.15} />
                <OrbitRing radius={8} angle={0.3} theme={theme} speed={0.12} />
                <OrbitRing radius={10} angle={-0.2} theme={theme} speed={-0.1} />
                <OrbitRing radius={12} angle={0} theme={theme} speed={0.08} />

                <MeteorSystem />
            </Canvas>
        </div>
    );
}
