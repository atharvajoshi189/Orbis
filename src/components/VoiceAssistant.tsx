"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Activity, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import * as THREE from "three";

// --- 3D Particle Sphere Component ---
function ParticleSphere({ isSpeaking, isListening, analyserRef, circleTexture }: { isSpeaking: boolean; isListening: boolean; analyserRef: React.MutableRefObject<AnalyserNode | null>, circleTexture: THREE.Texture }) {
    const pointsRef = useRef<THREE.Points>(null);
    const [count] = useState(2500); // Number of particles

    // Create initial positions for a sphere
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const distance = 1.8; // Radius
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Spherical coordinates to Cartesian
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
        const positionsAttribute = pointsRef.current.geometry.getAttribute('position');
        const count = positionsAttribute.count;

        // Get Audio Data
        let frequency = 0;
        if (isListening && analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            // Calculate average frequency for a simple "volume" metric
            const sum = dataArray.reduce((a, b) => a + b, 0);
            frequency = sum / dataArray.length; // Range 0-255 approx
        } else if (isSpeaking) {
            // Simulate frequency for TTS
            frequency = (Math.sin(time * 10) + 1) * 30 + (Math.random() * 20); // 0-80 range
        }

        // Animate Trigger
        // Base scale pulse
        const pulse = isSpeaking ? 1 + frequency / 200 : isListening ? 1 - frequency / 500 : 1;

        pointsRef.current.rotation.y = time * 0.1; // Idle rotation
        pointsRef.current.rotation.z = time * 0.05;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Original positions (approximate re-calculation or stored? For cheapness, we just modify current based on "noise")
            // Ideally we'd store original positions, but to save state complexity in this snippet:
            // We'll just add a "breathing" effect by scaling the whole object or adding noise to vertex

            // Let's do a simple "Explode" effect based on volume
            // We need original pos to do this cleanly without drift. 
            // In this specific task frame, we will just scale the entire group for the "pulse" 
            // and add some random jitter to rotation.
        }

        // Apply global scale interaction
        // Listening: Implode slightly (focus)
        // Speaking: Explode outward (express) - REDUCED MAGNITUDE
        // Gentle pulse: 1.1x max scale, with frequency adding a bit more "pop"
        const targetScale = isSpeaking ? 1.0 + (frequency / 300) : isListening ? 0.8 : 1;
        pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

        // Color Shift
        // Speaking: Cyan/Purple bright
        // Listening: White/Cyan focus
        // Material color is handled in prop but we can animate it here if needed.
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            {/* @ts-ignore */}
            <pointsMaterial
                size={0.03} // Smaller particles
                map={circleTexture} // Circular shape
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
}

export function VoiceAssistant({ onClose, onNewMessage }: VoiceAssistantProps) {
    const [status, setStatus] = useState<"listening" | "processing" | "speaking" | "idle">("idle");
    const [transcript, setTranscript] = useState("");

    // Voices
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    const [visualPrompt, setVisualPrompt] = useState<string | null>(null);

    // VAD Constants
    const VAD_THRESHOLD = 80; // Increased to ~30% volume to filter background noise
    const MIN_SPEECH_DURATION = 300; // Increased to 300ms to avoid short noise triggers

    // VAD Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);
    const statusRef = useRef(status); // To access status in event loops
    const speechStartTimeRef = useRef<number | null>(null); // Track duration of loud signal
    const isInterruptedRef = useRef(false); // Track barge-in events to prevent race conditions

    // Custom Endpointing Refs
    const recognitionRef = useRef<any>(null);
    const lastVoiceActivityTimeRef = useRef<number>(Date.now());
    const isSpeechDetectedRef = useRef(false); // Valid speech started?

    // Conversation History State
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

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

        // Setup VAD (but we won't use it for barge-in anymore)
        setupVAD();

        // Start Listening on Mount
        startListening();

        return () => {
            window.speechSynthesis.cancel();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const setupVAD = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // --- Dual-Threshold "Anti-Gravity" VAD Logic ---

        // 1. High-Energy Trigger Check
        if (average > VAD_THRESHOLD) {
            // Logic for visual feedback ONLY (no interruption)
            // We can use this to perhaps drive the visualizer intensity if needed

            // UPDATE: Track last known activity time for endpointing
            lastVoiceActivityTimeRef.current = Date.now();
            if (!isSpeechDetectedRef.current && statusRef.current === 'listening') {
                isSpeechDetectedRef.current = true;
                console.log("VAD: Speech Started (High Energy)");
            }
        }

        // --- CUSTOM SILENCE ENDPOINTING (Fast Response) ---
        // If we are listening, and we HAVE detected speech recently,
        // Check if silence has persisted for > 600ms
        if (statusRef.current === 'listening' && isSpeechDetectedRef.current) {
            const timeSinceLastSpeech = Date.now() - lastVoiceActivityTimeRef.current;

            if (timeSinceLastSpeech > 1500) { // Increased to 1500ms for better listening
                console.log("VAD: Silence Detected (>1500ms). Stopping recognition.");
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    // Reset to avoid double-stopping
                    isSpeechDetectedRef.current = false;
                }
            }
        }

        // REVERTED BARGE-IN: Do strictly nothing if we are already speaking or processing
        if (statusRef.current === 'speaking' || statusRef.current === 'processing') {
            rafRef.current = requestAnimationFrame(detectVoiceActivity);
            return;
        }

        rafRef.current = requestAnimationFrame(detectVoiceActivity);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition; // Store ref

        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Reset VAD state for new turn
        isSpeechDetectedRef.current = false;
        lastVoiceActivityTimeRef.current = Date.now();

        setStatus("listening");

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            setStatus("processing");
            processQuery(text);
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'aborted') return; // Ignore manual stops
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
        setVisualPrompt(null); // Reset visual

        // Update local history with user message
        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);

        // Prepare context (Append current user message to history)
        // We use a functional update for setMessages, so 'messages' here might be stale if we didn't just update it.
        // Actually, let's just use the previous state + new message for the payload.
        const currentHistory = [...messages, userMsg];

        try {
            // Context injection for better voice experience (System prompt handles this mostly now, but keeping for safety if needed)
            // Actually, we rely on server system prompt. We just send the history.

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: currentHistory,
                    studentYear: "Unknown"
                }),
            });

            if (!res.ok) {
                console.error(`API Error: ${res.status} ${res.statusText}`);
                const errData = await res.json().catch(() => ({}));
                console.error("API Error Details:", errData);
                throw new Error(errData.details || `Failed to fetch AI response (${res.status})`);
            }

            const aiMsg = await res.json();
            let content = aiMsg.content;
            let lang = 'en-IN'; // Default

            // Extract Language Tag
            const langMatch = content.match(/\[LANG: (.*?)\]/);
            if (langMatch) {
                lang = langMatch[1];
                content = content.replace(langMatch[0], '').trim();
            }

            // Extract Image Tag
            const imageMatch = content.match(/\[IMAGE: (.*?)\]/);
            if (imageMatch) {
                setVisualPrompt(imageMatch[1]);
                content = content.replace(imageMatch[0], '').trim();
            }

            onNewMessage('assistant', content);

            // Update local history with assistant response
            setMessages(prev => [...prev, { role: 'assistant', content: content }]);

            speakResponse(content, lang);

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

    const speakResponse = (text: string, langCode: string = 'en-IN') => {
        setStatus("speaking");
        const cleanText = stripMarkdown(text);

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Dynamic Voice Selection
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voice; // Default

        if (langCode && langCode !== 'en-IN') {
            // Try to find exact match or partial match
            const exactMatch = voices.find(v => v.lang === langCode);
            const partialMatch = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));

            if (exactMatch) selectedVoice = exactMatch;
            else if (partialMatch) selectedVoice = partialMatch;
        }

        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            // Check if we were interrupted (shouldn't happen with disabled barge-in, but safe to keep check false)
            if (isInterruptedRef.current) {
                isInterruptedRef.current = false;
                return;
            }

            setStatus("idle");
            // Auto-listen after response (Sequential Processing)
            startListening();
        };

        window.speechSynthesis.speak(utterance);


    };

    const handleMicClick = () => {
        if (status === 'listening') {
            // Stop listening logic if needed, or just let it be
        } else if (status === 'speaking') {
            // Manual stop is still allowed via click
            window.speechSynthesis.cancel();
            setStatus('idle');
            startListening();
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
                    <ParticleSphere isSpeaking={status === 'speaking'} isListening={status === 'listening'} analyserRef={analyserRef} circleTexture={circleTexture} />
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
                            &quot;{transcript}&quot;
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

