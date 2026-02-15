import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DID_API_KEY = process.env.DID_API_KEY;
const DID_AGENT_ID = process.env.DID_AGENT_ID;

// Define interfaces for better type safety
interface ChatRequest {
    message: string;
    sessionId: string;
    action: 'chat' | 'create';
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, message, sessionId } = body;

        // ---------------------------------------------------------
        // 1. CREATE SESSION (WebRTC)
        // ---------------------------------------------------------
        if (action === 'create') {
            if (!DID_API_KEY || !DID_AGENT_ID) {
                return NextResponse.json({ error: "Missing D-ID Credentials" }, { status: 500 });
            }

            // Create a new session with the Agent
            const sessionResponse = await fetch(`https://api.d-id.com/agents/${DID_AGENT_ID}/sessions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${DID_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!sessionResponse.ok) {
                const err = await sessionResponse.text();
                console.error("D-ID Session Error:", err);
                return NextResponse.json({ error: "Failed to create D-ID session", details: err }, { status: sessionResponse.status });
            }

            const sessionData = await sessionResponse.json();

            // sessionData typically contains { id: string, offer: string, ice_servers: ... }
            return NextResponse.json(sessionData);
        }

        // ---------------------------------------------------------
        // 2. CHAT INTERACTION
        // ---------------------------------------------------------
        if (action === 'chat') {
            if (!message || !sessionId) {
                return NextResponse.json({ error: "Message and Session ID required" }, { status: 400 });
            }

            // A. Get Response from OpenAI
            const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are Orbis Neural AI, a strategic career intelligence advisor. Provide structured, data-driven advice on study abroad, ROI, loan risk, government jobs, and career planning. Be professional, futuristic, and logical. Keep responses concise for speech."
                        },
                        { role: "user", content: message }
                    ]
                })
            });

            if (!openAIResponse.ok) {
                const err = await openAIResponse.text();
                return NextResponse.json({ error: "OpenAI Error", details: err }, { status: openAIResponse.status });
            }

            const aiData = await openAIResponse.json();
            const aiText = aiData.choices[0].message.content;

            // B. Send Response to D-ID Agent to Speak
            const chatResponse = await fetch(`https://api.d-id.com/agents/${DID_AGENT_ID}/sessions/${sessionId}/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${DID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: aiText,
                    streamId: sessionId // Sometimes needed depending on API version, but usually session ID in URL is enough
                })
            });

            if (!chatResponse.ok) {
                // If the session is expired or invalid, we need to handle that on frontend
                const err = await chatResponse.text();
                console.error("D-ID Chat Error:", err);
                return NextResponse.json({ error: "Failed to send to D-ID", details: err }, { status: chatResponse.status });
            }

            const chatData = await chatResponse.json();

            return NextResponse.json({
                success: true,
                aiResponse: aiText,
                didStatus: chatData
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Orbis Session Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
