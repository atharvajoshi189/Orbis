"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Cylinder, Float, MeshDistortMaterial, RoundedBox, Trail, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function RobotModel() {
    const headRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Mesh>(null);
    const leftHandRef = useRef<THREE.Group>(null); // Ref for waving hand

    const [hovered, setHovered] = useState(false);
    const [blink, setBlink] = useState(false);

    // Blinking logic
    useEffect(() => {
        const blinkLoop = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkLoop);
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (headRef.current) {
            // Natural head idle movement
            headRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
            headRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
            headRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
        }
        if (bodyRef.current) {
            // Breathing animation
            bodyRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
        }

        // --- WAVING ANIMATION ---
        if (leftHandRef.current) {
            // Complex wave motion: Up/Down + Rotation
            // Base speed variable to make it wave in bursts or continuous? Let's go continuous but smooth.
            const waveSpeed = 6;

            // Raise hand
            // leftHandRef.current.position.y = -0.1 + (Math.sin(t * 2) > 0 ? 0.3 : 0); // Simple raise

            // Pivot rotation for waving (Z axis)
            // We want it to wave roughly every few seconds or continuously. 
            // Let's make it always wave for now as per user request to "make it wave".

            // Position offset to raise arm
            leftHandRef.current.position.y = -0.1 + Math.abs(Math.sin(t * 1)) * 0.2;

            // Waving rotation
            leftHandRef.current.rotation.z = Math.cos(t * waveSpeed) * 0.4 - 0.5; // Wave between angles
        }
    });

    // Metallic Blue Material
    // White Body Material
    const metallicBlueMaterial = (
        <meshPhysicalMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
            roughness={0.2}
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
        />
    );

    // Accent Material
    const glossyWhiteMaterial = (
        <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.2}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
        />
    );

    return (
        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
            <group
                scale={hovered ? 1.05 : 1}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* --- HEAD --- */}
                <group position={[0, 0.65, 0]} ref={headRef}>
                    {/* Main Head Shape (Squircle) */}
                    <RoundedBox args={[0.85, 0.7, 0.65]} radius={0.35} smoothness={4}>
                        {metallicBlueMaterial}
                    </RoundedBox>

                    {/* Face Screen (Glass) */}
                    <RoundedBox args={[0.7, 0.55, 0.05]} radius={0.2} position={[0, 0, 0.31]}>
                        <meshPhysicalMaterial color="#000000" roughness={0.2} metalness={0.9} />
                    </RoundedBox>

                    {/* EYES (Binking) */}
                    <group position={[0, 0, 0.34]}>
                        <mesh scale={[1, blink ? 0.1 : 1, 1]} position={[-0.2, 0.05, 0]}>
                            <capsuleGeometry args={[0.09, 0.14, 4, 8]} />
                            <meshBasicMaterial color="#00ffff" toneMapped={false} />
                        </mesh>
                        <mesh scale={[1, blink ? 0.1 : 1, 1]} position={[0.2, 0.05, 0]}>
                            <capsuleGeometry args={[0.09, 0.14, 4, 8]} />
                            <meshBasicMaterial color="#00ffff" toneMapped={false} />
                        </mesh>
                    </group>

                    {/* Antennas (Ears) */}
                    <group position={[0.5, 0.1, 0]} rotation={[0, 0, -0.3]}>
                        <Cylinder args={[0.03, 0.03, 0.25]} >{glossyWhiteMaterial}</Cylinder>
                        <Sphere args={[0.1]} position={[0, 0.2, 0]}><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} /></Sphere>
                    </group>
                    <group position={[-0.5, 0.1, 0]} rotation={[0, 0, 0.3]}>
                        <Cylinder args={[0.03, 0.03, 0.25]} >{glossyWhiteMaterial}</Cylinder>
                        <Sphere args={[0.1]} position={[0, 0.2, 0]}><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} /></Sphere>
                    </group>
                </group>

                {/* --- BODY --- */}
                <group position={[0, -0.25, 0]}>
                    <Sphere args={[0.5, 32, 32]} ref={bodyRef}>
                        {metallicBlueMaterial}
                    </Sphere>

                    {/* Chest Glowing Core (Arc Reactor style) */}
                    <mesh position={[0, 0.1, 0.42]}>
                        <ringGeometry args={[0.08, 0.13, 32]} />
                        <meshBasicMaterial color="#00ffff" toneMapped={false} />
                    </mesh>
                    <Sphere args={[0.07, 32, 32]} position={[0, 0.1, 0.4]}>
                        <meshBasicMaterial color="#ffffff" toneMapped={false} />
                    </Sphere>
                </group>

                {/* --- FLOATING HANDS --- */}

                {/* Right Hand (Idle) */}
                <group position={[0.65, -0.1, 0.2]}>
                    <Sphere args={[0.14, 32, 32]}>{glossyWhiteMaterial}</Sphere>

                    {/* Floating Idea Bulb - Only on right hand */}
                    <group position={[0, 0.5, 0]}>
                        <Float speed={5} rotationIntensity={0} floatIntensity={1}>
                            <pointLight distance={1.5} intensity={2} color="#ffff00" />
                            <mesh>
                                <sphereGeometry args={[0.15, 16, 16]} />
                                <meshBasicMaterial color="#FFFFaa" toneMapped={false} transparent opacity={0.8} />
                            </mesh>
                        </Float>
                    </group>
                </group>

                {/* Left Hand (Waving) */}
                <group position={[-0.65, -0.1, 0.2]} ref={leftHandRef}>
                    <Sphere args={[0.14, 32, 32]}>{glossyWhiteMaterial}</Sphere>
                </group>

            </group>

            {/* Shadow for grounding */}
            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={6} blur={3} far={4} color="#00dfff" />
        </Float>
    );
}

export default function Robot3D() {
    return (
        <div className="w-full h-full">
            {/* Zoomed in camera: Z adjusted from 4.5 to 3.2 */}
            <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} dpr={[1, 2]}>

                {/* Lighting Setup for Realism */}
                <ambientLight intensity={0.7} />
                <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-5, -5, 5]} intensity={1.5} color="#22d3ee" />
                <pointLight position={[5, -5, 5]} intensity={1} color="#a855f7" />

                <RobotModel />
            </Canvas>
        </div>
    );
}
