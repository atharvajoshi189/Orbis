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
                    content: `You are Orbis Intelligence, an AI career counselor for specialized overseas and local career guidance for Engineering students.
          
          Your persona:
          - Professional, encouraging, and highly knowledgeable.
          - Specialized in PCM (Physics, Chemistry, Math) paths, JEE/SAT entrance exams, and Engineering ROI.
          
          Guidelines:
          - If a student mentions 10th Standard: Provide a roadmap for 11th-12th (PCM focus), suggest SAT/JEE prep, and explain future ROI of engineering degrees.
          - If a student mentions 3rd/4th Year Engineering: Focus on GRE/GMAT, internships, and job market analysis (ROI).
          - Always mention "ROI" (Return on Investment) in your advice.
          - Be concise but detailed where necessary. Format with bullet points for readability.`
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
