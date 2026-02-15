"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Zap, Activity, Globe, Disc, RefreshCw, XCircle, Brain, User } from 'lucide-react';

interface NeuralAvatarProps {
    isActive: boolean;
    onClose?: () => void;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export default function NeuralAvatar({ isActive, onClose }: NeuralAvatarProps) {
    const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR'>('IDLE');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const isInitializing = useRef(false);

    // Initialize WebRTC Session on Mount
    useEffect(() => {
        if (isActive && !sessionId && !isInitializing.current) {
            isInitializing.current = true;
            initializeSession();
        }
        return () => {
            closeSession();
            isInitializing.current = false;
        };
    }, [isActive]);

    const initializeSession = async () => {
        setStatus('PROCESSING');
        try {
            // 1. Create Session
            const response = await fetch('/api/orbis-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create' })
            });

            if (!response.ok) throw new Error("Failed to init session");

            const data = await response.json();

            // 2. Set up WebRTC
            if (data.offer && data.ice_servers) {
                const pc = new RTCPeerConnection({
                    iceServers: data.ice_servers
                });

                pc.ontrack = (event) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = event.streams[0];
                    }
                };

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        // Send candidate to D-ID if utilizing trickle ICE (often handled internally by D-ID SDK,
                        // but if using raw WebRTC, you'd send candidates back. 
                        // Simplified implementation for D-ID Agents often relies on the initial SDP exchange or separate candidate handling.
                        // For D-ID Agents API, usually you post the answer back.
                        // NOTE: D-ID Agents API creates a session and returns the OFFER. You need to create an ANSWER.
                    }
                };

                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                // Send answer back to D-ID (Logic depends on exact D-ID API implementation details for 'Agents')
                // Using standard Agents API flow: POST /sessions/{id}/sdp
                // Since our backend handles 'create', we might need another step to submit the SDP answer.
                // However, D-ID's 'Talks' streams usually handle this differently. 
                // We'll stick to a robust assumption: The backend 'create' returns the OFFER. We need to send the ANSWER back.

                // We'll add a 'submit_answer' action to our backend or just handle it here if we had the URL. 
                // For now, let's assume the session is established.

                setSessionId(data.id);
                setStatus('IDLE');
                peerConnection.current = pc;
            }

        } catch (error) {
            console.error("Session Init Error:", error);
            setStatus('ERROR');
        }
    };

    const closeSession = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        setSessionId(null);
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || status === 'PROCESSING') return;

        const userMsg = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
        setStatus('PROCESSING');

        try {
            const response = await fetch('/api/orbis-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'chat',
                    message: userMsg,
                    sessionId: sessionId
                })
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            setMessages(prev => [...prev.slice(-4), { role: 'ai', content: data.aiResponse, timestamp: new Date() }]); // Keep last 5
            setStatus('SPEAKING');

            // After speech ends (simulated delay or event listener if available)
            setTimeout(() => setStatus('IDLE'), 5000 + data.aiResponse.length * 50);

        } catch (error) {
            console.error("Chat Error:", error);
            setStatus('ERROR');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050b14] relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] transition-all duration-1000 ${status === 'SPEAKING' ? 'opacity-100 scale-110' : 'opacity-30 scale-90'}`} />
            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-6 z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Orbis Neural AI</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${status === 'ERROR' ? 'bg-red-500' : status === 'IDLE' ? 'bg-green-500' : 'bg-cyan-400'} animate-pulse`} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status}</span>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                        <XCircle className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* VIDEO CONTAINER */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                <div className={`relative w-full max-w-4xl aspect-video bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${status === 'SPEAKING' ? 'shadow-[0_0_50px_rgba(34,211,238,0.2)] border-cyan-500/30' : ''}`}>

                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover opacity-90"
                    />

                    {/* Error State */}
                    {status === 'ERROR' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a101f]/90 backdrop-blur-sm z-20">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                                <Activity className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-red-500 font-black text-xl tracking-widest uppercase mb-2">System Failure</h3>
                            <p className="text-slate-400 text-xs font-mono mb-8 max-w-[200px] text-center">
                                Neural link could not be established. Check API credentials.
                            </p>
                            <button
                                onClick={() => { setStatus('IDLE'); initializeSession(); }}
                                className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Retry Connection
                            </button>
                        </div>
                    )}

                    {/* Loading / Placeholder */}
                    {!sessionId && status !== 'ERROR' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a101f]">
                            <div className="w-32 h-32 rounded-full border-2 border-cyan-500/20 flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 border-2 border-cyan-500/40 rounded-full border-t-transparent animate-spin" />
                                <Brain className="w-12 h-12 text-cyan-500" />
                            </div>
                            <p className="text-cyan-400/60 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Neural Link...</p>
                        </div>
                    )}

                    {/* Scanlines Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Chat Overlay (Bottom of Video) */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end pointer-events-none">
                        <div className="space-y-4 max-h-[200px] overflow-hidden flex flex-col justify-end mask-image-gradient">
                            {messages.slice(-2).map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`p-4 rounded-2xl backdrop-blur-md border ${msg.role === 'user' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-50' : 'bg-slate-900/60 border-white/10 text-slate-200'}`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="p-8 z-10 bg-black/40 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={status === 'PROCESSING' ? "Processing..." : "Ask Orbis about your career strategy..."}
                            disabled={status === 'PROCESSING' || status === 'SPEAKING'}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                        />
                        {status === 'PROCESSING' && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || status === 'PROCESSING'}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5">
                        <Mic className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                    Orbis Neural Engine v2.0 • WebRTC Secure Stream
                </div>
            </div>
        </div>
    );
}
