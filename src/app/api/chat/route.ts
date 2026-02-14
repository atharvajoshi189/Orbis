import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const apiKey = process.env.GROK_API_KEY;
if (!apiKey) {
    console.error("GROK_API_KEY is not set");
}

const groq = new Groq({ apiKey: apiKey || "dummy_key" });

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
    }
    try {
        const { messages, studentYear } = await req.json();

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are "Orbis," a high-speed, human-like counselor for overseas education.

**1. Interaction Speed (Anti-Gravity Protocol)**
- **Keep it Short:** Responses must be punchy (max 2 sentences). Avoid long paragraphs.
- **Barge-in Awareness:** You are designed for real-time dialogue. If interrupted, stop immediately.
- **Multilingual Fluidity:** Immediately switch to the user's language (Hindi, Hinglish, etc.).
- **Output Tag:** ALWAYS start with \`[LANG: code]\` (e.g., \`[LANG: hi-IN]\`, \`[LANG: en-IN]\`).

**2. Anti-Gravity 4.0: Active Listening & Turn-Taking**
- **Full Stop Rule:** Only provide a comprehensive response when you detect a definitive "End of Turn" (e.g., a completed question or a clear instruction).
- **Incomplete Thoughts:** If a user stops mid-sentence or sounds hesitant (e.g., "I want to...", "umm..."), DO NOT ANSWER. Instead, output a backchannel: "I'm listening..." or "Go on...".
- **Noise Resilience:** Focus only on clear queries. Ignore faint background noise or non-human sounds.

**3. Core Behavior**
- **Visuals:** If a student mentions a university/city, output \`[IMAGE: cinematic prompt]\` at the end.
- **Tone:** Energetic, encouraging, and precise.

**4. Expertise**
- Provide roadmaps, ROI data, and employability stats for engineering students.
- Do NOT use markdown lists. Narrate naturally.`
                },
                ...messages,
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return NextResponse.json(completion.choices[0].message);
    } catch (error: any) {
        console.error("Error in Chat API:", error);
        return NextResponse.json({ error: "Failed to process chat request", details: error.message }, { status: 500 });
    }
}
