"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Activity, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import * as THREE from "three";

import Avatar3D from "@/components/Avatar3D";

// --- 3D Particle Sphere Component ---
function ParticleSphere({ isSpeaking, isListening, circleTexture }: { isSpeaking: boolean; isListening: boolean; circleTexture: THREE.Texture }) {
    const pointsRef = useRef<THREE.Points>(null);
    const [count] = useState(2500);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const distance = 1.8;
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.getElapsedTime();

        // Simulating frequency since we switched to procedural fallback mostly
        let frequency = 0;
        if (isSpeaking) {
            frequency = (Math.sin(time * 10) + 1) * 30 + (Math.random() * 20);
        } else if (isListening) {
            frequency = (Math.sin(time * 5) + 1) * 10;
        }

        const targetScale = isSpeaking ? 1.0 + (frequency / 300) : isListening ? 0.8 : 1;
        pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        pointsRef.current.rotation.y = time * 0.1;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            {/* @ts-ignore */}
            <pointsMaterial
                size={0.03}
                map={circleTexture}
                alphaTest={0.5}
                color={isSpeaking ? "#a855f7" : isListening ? "#ef4444" : "#22d3ee"}
                transparent
                opacity={0.8}
                sizeAttenuation={true}
            />
        </points>
    );
}

// --- Main Voice Assistant Component ---
interface VoiceAssistantProps {
    onClose: () => void;
    onNewMessage: (role: 'user' | 'assistant', content: string) => void;
    mode?: 'voice' | 'avatar';
    initialMessage?: string; // NEW PROP
}

export function VoiceAssistant({ onClose, onNewMessage, mode = 'voice', initialMessage }: VoiceAssistantProps) {
    const [status, setStatus] = useState<"listening" | "processing" | "speaking" | "idle">("idle");
    const [transcript, setTranscript] = useState("");
    const [gesture, setGesture] = useState("IDLE");

    // Voices
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    // VAD Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null); // Still used for VAD (Mic input)
    const listentStreamRef = useRef<MediaStream | null>(null); // Store stream for cleanup
    const rafRef = useRef<number | null>(null);
    const statusRef = useRef(status);
    const isMountedRef = useRef(true); // Track mount status

    // Custom Endpointing Refs
    // Custom Endpointing Refs
    const recognitionRef = useRef<any>(null);
    const lastVoiceActivityTimeRef = useRef<number>(Date.now());
    const isSpeechDetectedRef = useRef(false);

    // Track stream globally for this component instance to ensure no leaks
    const activeStreamRef = useRef<MediaStream | null>(null);

    // Helper for circular particles
    const circleTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            context.beginPath();
            context.arc(16, 16, 14, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    useEffect(() => { statusRef.current = status; }, [status]);

    // Cleanup Function - SCORCHED EARTH POLICY
    const cleanup = () => {
        isMountedRef.current = false; // Checkmate for async ops

        // 1. Stop all media tracks immediately (Primary Stream)
        const stopTracks = (stream: MediaStream | null) => {
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
            }
        };

        stopTracks(listentStreamRef.current);
        listentStreamRef.current = null;

        stopTracks(activeStreamRef.current);
        activeStreamRef.current = null;

        // 2. Cancel Speech Synthesis
        window.speechSynthesis.cancel();

        // 3. Stop Animation Frame
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        // 4. Close AudioContext
        if (audioContextRef.current) {
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(e => console.error("AudioContext close error", e));
            }
            audioContextRef.current = null;
        }

        // 5. Abort Speech Recognition
        if (recognitionRef.current) {
            try {
                recognitionRef.current.onend = null; // Prevent onend trigger
                recognitionRef.current.onerror = null; // Prevent error trigger
                recognitionRef.current.abort();
            } catch (e) { /* ignore */ }
            recognitionRef.current = null;
        }
    };

    const handleClose = () => {
        cleanup();
        onClose();
    };

    // Initial Setup
    useEffect(() => {
        isMountedRef.current = true;
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const indianVoice = voices.find(v => v.lang.includes('en-IN')) || voices[0];
            setVoice(indianVoice);

            // Speak Initial Message if available and voice is ready
            if (initialMessage && indianVoice) {
                // We need a slight delay or check to ensure voice is set
                setTimeout(() => speakResponse(initialMessage, indianVoice), 500);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        setupVAD();
        if (!initialMessage) {
            startListening();
        }

        return () => {
            cleanup();
        };
    }, []);

    // Overload speakResponse to optionally accept voice arg to avoid state closure issues in useEffect
    const speakResponse = (text: string, specificVoice?: SpeechSynthesisVoice) => {
        setStatus("speaking");
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = specificVoice || voice || null;
        utterance.rate = 1.0;

        utterance.onend = () => {
            setStatus("idle");
            setGesture("IDLE"); // Return to idle after speaking
            startListening(); // Linear conversation flow
        };

        window.speechSynthesis.speak(utterance);
    };

    const setupVAD = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            activeStreamRef.current = stream; // Track internally cleanup

            // Check if unmounted during await
            if (!isMountedRef.current) {
                stream.getTracks().forEach(track => track.stop());
                activeStreamRef.current = null;
                return;
            }

            listentStreamRef.current = stream;
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 256;
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            detectVoiceActivity();
        } catch (err) {
            console.error("VAD Setup Error:", err);
        }
    };

    const detectVoiceActivity = () => {
        if (!analyserRef.current) return;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

        // VAD Logic
        if (average > 30) { // Threshold
            lastVoiceActivityTimeRef.current = Date.now();
            if (!isSpeechDetectedRef.current && statusRef.current === 'listening') {
                isSpeechDetectedRef.current = true;
            }
        }

        // Endpointing
        if (statusRef.current === 'listening' && isSpeechDetectedRef.current) {
            const timeSinceLastSpeech = Date.now() - lastVoiceActivityTimeRef.current;
            if (timeSinceLastSpeech > 1500) {
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    isSpeechDetectedRef.current = false;
                }
            }
        }

        rafRef.current = requestAnimationFrame(detectVoiceActivity);
    };

    const startListening = () => {
        if (!isMountedRef.current) return; // Prevent start if unmounted/closing

        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition not supported.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        isSpeechDetectedRef.current = false;
        lastVoiceActivityTimeRef.current = Date.now();
        setStatus("listening");
        setGesture("IDLE"); // Reset gesture on listen

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            setStatus("processing");
            setGesture("THINKING"); // Thinking pose while processing
            processQuery(text);
        };

        recognition.onerror = (event: any) => {
            if (event.error !== 'aborted') {
                console.error("Speech Error:", event.error);
                setStatus("idle");
            }
        };

        recognition.onend = () => {
            if (status === 'listening') setStatus("idle");
        };

        recognition.start();
    };

    const processQuery = async (text: string) => {
        onNewMessage('user', text);

        // Pass userId manually or fetch from store (Assuming Guest for now for Voice Mode simplicity, or you can add supabase check)
        // Ideally we fetch userId here too.
        let userId = null;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: text }], // Simplify history for voice for now
                    userId: userId
                }),
            });

            if (!res.ok) throw new Error('API Error');

            const aiMsg = await res.json();

            // Handle New JSON Format
            const content = aiMsg.speech || aiMsg.content || "I am processing that.";
            const gesture = aiMsg.gesture || "GREETING";

            // Handle Real-Time Sync Triggers
            if (content.toLowerCase().includes("cgpa") || aiMsg.roi_stat?.toLowerCase().includes("cgpa")) {
                // Dispatch event to highlight CGPA
                window.dispatchEvent(new CustomEvent('highlight-cgpa'));
            }

            onNewMessage('assistant', content); // Show text in chat
            setGesture(gesture); // Update Avatar Gesture
            speakResponse(content);

        } catch (error) {
            console.error(error);
            setStatus("idle");
            setGesture("IDLE");
            speakResponse("I'm having trouble connecting. Please try again.");
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center font-sans"
        >
            {/* Overlay Elements */}
            <div className="absolute top-6 left-6 z-10">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 border border-white/10 rounded-full px-4" onClick={handleClose}>
                    <MessageSquare size={18} /> Back to Chat
                </Button>
            </div>

            {/* Close Button */}
            <div className="absolute top-6 right-6 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-white/10 rounded-full w-12 h-12 transition-all duration-300 group"
                    onClick={handleClose}
                >
                    <X size={24} className="group-hover:scale-110 transition-transform" />
                </Button>
            </div>

            {/* 3D VISUALIZER AREA */}
            <div className="w-full h-full absolute inset-0">
                {mode === 'avatar' ? (
                    <Avatar3D gesture={gesture} isSpeaking={status === 'speaking'} />
                ) : (
                    <Canvas camera={{ position: [0, 0, 4.5] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
                        <ParticleSphere isSpeaking={status === 'speaking'} isListening={status === 'listening'} circleTexture={circleTexture} />
                    </Canvas>
                )}
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
                            &quot;{transcript}&quot;
                        </motion.p>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        animate={{ scale: status === 'listening' ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`h-20 w-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:scale-105 active:scale-95 ${status === 'listening' ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' :
                            status === 'speaking' ? 'bg-cyan-600 shadow-[0_0_50px_rgba(34,211,238,0.4)]' :
                                'bg-cyan-600/50'
                            }`}
                        onClick={() => status === 'speaking' ? window.speechSynthesis.cancel() : startListening()}
                    >
                        {status === 'speaking' ? <Activity size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                    </motion.div>

                    <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase mt-2 animate-pulse">
                        {status === 'listening' ? "Listening..." :
                            status === 'processing' ? "Analyzing..." :
                                status === 'speaking' ? "Orbis Speaking..." :
                                    "Tap to Speak"}
                    </p>
                </div>
            </div>

        </motion.div>
    );
}

