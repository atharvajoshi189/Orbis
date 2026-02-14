"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, Environment, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

// Standard Ready Player Me Male Avatar (Business Casual)
const AVATAR_URL = "https://models.readyplayer.me/64b73eac47087617da5c3456.glb";

type AvatarProps = {
    gesture: string; // "POINTING" | "GREETING" | "THINKING"
    isSpeaking: boolean;
    audioAnalyser?: AnalyserNode | null;
};

function Model({ gesture, isSpeaking, audioAnalyser }: AvatarProps) {
    const { scene } = useGLTF(AVATAR_URL);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    // Refs for bones
    const headRef = useRef<THREE.Object3D | null>(null);
    const rightArmRef = useRef<THREE.Object3D | null>(null);
    const leftArmRef = useRef<THREE.Object3D | null>(null);
    const neckRef = useRef<THREE.Object3D | null>(null);
    const rightHandRef = useRef<THREE.Object3D | null>(null);

    // Refs for Morph Targets (Mouth)
    const headMeshRef = useRef<THREE.SkinnedMesh | null>(null);

    useEffect(() => {
        // Identify bones and meshes
        clone.traverse((child) => {
            if ((child as THREE.Bone).isBone) {
                if (child.name === 'Head') headRef.current = child;
                if (child.name === 'Neck') neckRef.current = child;
                if (child.name === 'RightArm') rightArmRef.current = child;
                if (child.name === 'LeftArm') leftArmRef.current = child;
                if (child.name === 'RightHand') rightHandRef.current = child;
            }
            if ((child as THREE.SkinnedMesh).morphTargetDictionary) {
                if (child.name === 'Wolf3D_Head' || child.name === 'Wolf3D_Avatar') {
                    headMeshRef.current = child as THREE.SkinnedMesh;
                }
            }
        });
    }, [clone]);

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        // --- 1. LIP SYNC (Audio Driven) ---
        if (headMeshRef.current && headMeshRef.current.morphTargetDictionary && headMeshRef.current.morphTargetInfluences) {
            let volume = 0;
            if (isSpeaking) {
                if (audioAnalyser) {
                    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
                    audioAnalyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    const limit = Math.floor(dataArray.length / 4);
                    for (let i = 0; i < limit; i++) sum += dataArray[i];
                    volume = (sum / limit) / 256;
                } else {
                    // Procedural Fallback for TTS (since we can't capture speechSynthesis stream easily)
                    // Simple random/sine wave to simulate speech
                    volume = Math.max(0, Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.3 + 0.2);
                }
            }

            // Smoothly interpolate mouth opening
            const targetOpen = isSpeaking ? (volume * 1.2) : 0;
            const mouthOpenIndex = headMeshRef.current.morphTargetDictionary['mouthOpen'];
            const visemeaaIndex = headMeshRef.current.morphTargetDictionary['viseme_aa'];

            if (mouthOpenIndex !== undefined) {
                headMeshRef.current.morphTargetInfluences[mouthOpenIndex] = THREE.MathUtils.lerp(
                    headMeshRef.current.morphTargetInfluences[mouthOpenIndex],
                    targetOpen,
                    0.2
                );
            }
            if (visemeaaIndex !== undefined) {
                headMeshRef.current.morphTargetInfluences[visemeaaIndex] = THREE.MathUtils.lerp(
                    headMeshRef.current.morphTargetInfluences[visemeaaIndex],
                    targetOpen * 0.8,
                    0.2
                );
            }
        }

        // --- 2. GESTURE ANIMATION (Procedural) ---
        // Helper for smooth rotation
        const lerpRot = (bone: THREE.Object3D | null, target: THREE.Euler, speed = 4) => {
            if (bone) {
                bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, target.x, speed * delta);
                bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, target.y, speed * delta);
                bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, target.z, speed * delta);
            }
        };

        // Reset Poses
        const defaultArmRot = new THREE.Euler(0, 0, 1.2); // Arms down
        const defaultHeadRot = new THREE.Euler(0, 0, 0);

        if (gesture === 'THINKING') {
            // Hand to chin
            lerpRot(rightArmRef.current, new THREE.Euler(-1.5, 0.5, 0.5));
            lerpRot(rightHandRef.current, new THREE.Euler(0, 0, 0));
            // Head tilt
            lerpRot(neckRef.current, new THREE.Euler(0.2, -0.2, 0));
        } else if (gesture === 'POINTING') {
            // Point forward
            lerpRot(rightArmRef.current, new THREE.Euler(-1.5, -0.2, 0));
            lerpRot(rightHandRef.current, new THREE.Euler(0, 0, 0));
            // Head follow
            lerpRot(neckRef.current, new THREE.Euler(0, -0.1, 0));
        } else if (gesture === 'GREETING') {
            // Wave
            const wave = Math.sin(t * 8) * 0.5;
            lerpRot(rightArmRef.current, new THREE.Euler(-2.5, 0, -0.5 + wave));
            lerpRot(neckRef.current, new THREE.Euler(0, 0, 0));
        } else {
            // IDLE
            lerpRot(rightArmRef.current, new THREE.Euler(0, 0, 1.2 + Math.sin(t) * 0.05));
            lerpRot(leftArmRef.current, new THREE.Euler(0, 0, -1.2 - Math.sin(t) * 0.05));
            lerpRot(neckRef.current, new THREE.Euler(Math.sin(t * 0.5) * 0.05, Math.sin(t * 0.3) * 0.05, 0));

            // Breathing
            if (neckRef.current) neckRef.current.position.y = Math.sin(t * 1) * 0.002;
        }

    });

    return <primitive object={clone} position={[0, -1.6, 0]} />;
}

export default function Avatar3D({ gesture, isSpeaking, audioAnalyser }: AvatarProps) {
    return (
        <div className="w-full h-full min-h-[300px] relative">
            <Canvas camera={{ position: [0, 0, 0.6], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Environment preset="city" />
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                    <Model gesture={gesture} isSpeaking={isSpeaking} audioAnalyser={audioAnalyser} />
                </Float>
                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300 ${gesture === 'POINTING' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
                    gesture === 'THINKING' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                        gesture === 'GREETING' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                            'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                    {gesture || "IDLE"} Protocol
                </div>
            </div>
        </div>
    );
}
