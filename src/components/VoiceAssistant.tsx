"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Activity, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import * as THREE from "three";

// --- 3D Sphere Component ---
function PulsatingSphere({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [distort, setDistort] = useState(0.4);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Rotate slightly
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;

        // Dynamic Distortion based on state
        const targetDistort = isSpeaking ? 0.8 : isListening ? 0.3 : 0.4;
        setDistort(THREE.MathUtils.lerp(distort, targetDistort + Math.sin(time * 5) * 0.1, 0.1));
    });

    const color = isSpeaking ? "#22d3ee" : isListening ? "#a855f7" : "#0ea5e9";

    return (
        <Sphere args={[1.5, 64, 64]} ref={meshRef}>
            {/* @ts-ignore */}
            <MeshDistortMaterial
                color={color}
                envMapIntensity={0.5}
                clearcoat={0.8}
                clearcoatRoughness={0}
                metalness={0.2}
                distort={distort}
                speed={2}
            />
        </Sphere>
    );
}

// --- Main Voice Assistant Component ---
interface VoiceAssistantProps {
    onClose: () => void;
    onNewMessage: (role: 'user' | 'assistant', content: string) => void;
}

export function VoiceAssistant({ onClose, onNewMessage }: VoiceAssistantProps) {
    const [status, setStatus] = useState<"listening" | "processing" | "speaking" | "idle">("idle");
    const [transcript, setTranscript] = useState("");

    // Voices
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    // Initial Setup
    useEffect(() => {
        // Load Voices
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Try to find an Indian English voice
            const indianVoice = voices.find(v => v.lang.includes('en-IN')) || voices[0];
            setVoice(indianVoice);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Start Listening on Mount
        startListening();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setStatus("listening");

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            setStatus("processing");
            processQuery(text);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Error:", event.error);
            setStatus("idle");
        };

        recognition.onend = () => {
            // If we didn't get any result/processing started, go back to idle
            if (status === 'listening') setStatus("idle");
        };

        recognition.start();
    };

    const stripMarkdown = (text: string) => {
        return text
            .replace(/[*_#`\[\]]/g, '') // Remove formatting chars
            .replace(/\n\n/g, '. ')     // Replace double breaks with pauses
            .replace(/\n/g, ' ');       // Replace single breaks with spaces
    };

    const processQuery = async (text: string) => {
        onNewMessage('user', text); // Add user msg to visual chat immediately

        try {
            // Context injection for better voice experience
            const voiceContext = `${text} (Answer concisely and conversationally for voice output, max 2 sentences)`;

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: voiceContext }],
                    studentYear: "Unknown"
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch AI response');

            const aiMsg = await res.json();
            onNewMessage('assistant', aiMsg.content);
            speakResponse(aiMsg.content);

            // Save to Supabase (Fire and forget)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('chat_history').insert([
                    { student_id: user.id, role: 'user', content: text },
                    { student_id: user.id, role: 'assistant', content: aiMsg.content }
                ]);
            }

        } catch (error) {
            console.error(error);
            setStatus("idle");
            speakResponse("I'm having trouble connecting right now. Please try again.");
        }
    };

    const speakResponse = (text: string) => {
        setStatus("speaking");
        const cleanText = stripMarkdown(text);

        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            setStatus("idle");
            // Optional: Auto-listen again after speaking?
            // setTimeout(startListening, 500); 
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleMicClick = () => {
        if (status === 'listening') {
            // Stop listening logic if needed, or just let it be
        } else if (status === 'speaking') {
            window.speechSynthesis.cancel();
            setStatus('idle');
        } else {
            startListening();
        }
    }


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center font-sans"
        >
            {/* Overlay Elements */}
            <div className="absolute top-6 left-6 z-10">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 border border-white/10 rounded-full px-4" onClick={onClose}>
                    <MessageSquare size={18} /> Back to Chat
                </Button>
            </div>

            {/* 3D Visualizer */}
            <div className="w-full h-full absolute inset-0">
                <Canvas camera={{ position: [0, 0, 4.5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
                    <PulsatingSphere isSpeaking={status === 'speaking'} isListening={status === 'listening'} />
                </Canvas>
            </div>

            {/* Status & Controls */}
            <div className="absolute bottom-12 z-20 flex flex-col items-center gap-6 w-full max-w-lg px-6 text-center">

                <AnimatePresence mode="wait">
                    {transcript && status !== 'listening' && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-white/60 text-lg font-light italic"
                        >
                            "{transcript}"
                        </motion.p>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        animate={{ scale: status === 'listening' ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`h-20 w-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:scale-105 active:scale-95 ${status === 'listening' ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' :
                            status === 'speaking' ? 'bg-purple-600 shadow-[0_0_50px_rgba(168,85,247,0.4)]' :
                                'bg-cyan-600 hover:bg-cyan-500'
                            }`}
                        onClick={handleMicClick}
                    >
                        {status === 'speaking' ? <Activity size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                    </motion.div>

                    <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mt-2 animate-pulse">
                        {status === 'listening' ? "Listening..." :
                            status === 'processing' ? "Processing..." :
                                status === 'speaking' ? "Orbis Speaking..." :
                                    "Tap to Speak"}
                    </p>
                </div>
            </div>

        </motion.div>
    );
}
