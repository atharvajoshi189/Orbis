import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';



export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY; // Fallback check
        if (!apiKey) {
            console.error("GROQ_API_KEY is missing");
            return NextResponse.json({
                error: "Configuration Error",
                details: "GROQ_API_KEY is missing in environment variables. Please add it to your .env.local file."
            }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        const { profile } = await req.json();

        if (!profile) {
            return NextResponse.json({ error: "Profile data required" }, { status: 400 });
        }

        const systemPrompt = `
        You are the "Orbis Career Engine". Analyze the user's profile and generate 3 distinct career roadmaps (Fast-Track, Growth, Mastery) to help them achieve their career goal.

        **User Profile:**
        - Name: ${profile.full_name}
        - Current Status: ${profile.current_year}
        - Major: ${profile.major}
        - Skills: ${profile.skills?.join(", ")}
        - Career Goal: ${profile.career_goal}
        - Target Country: ${profile.target_country}

        **Output Format (Strict JSON):**
        {
            "fast_track": {
                "title": "Express Route",
                "duration": "2 Months",
                "description": "Intensive bootcamp-style plan to get job-ready quickly.",
                "total_xp": 2000,
                "milestones": [
                    { "day": 1, "task": "Task Name", "xp": 50, "status": "pending" },
                    // ... 5-7 key milestones
                ]
            },
            "growth": {
                "title": "Standard Growth",
                "duration": "6 Months",
                "description": "Balanced approach building strong fundamentals and projects.",
                "total_xp": 5000,
                "milestones": [
                    { "day": 1, "task": "Task Name", "xp": 50, "status": "pending" }
                    // ... 10-12 milestones
                ]
            },
            "mastery": {
                "title": "Deep Dive Mastery",
                "duration": "1 Year",
                "description": "Comprehensive path to become a subject matter expert.",
                "total_xp": 12000,
                "milestones": [
                    { "day": 1, "task": "Task Name", "xp": 50, "status": "pending" }
                    // ... 15+ milestones
                ]
            }
        }
        
        Ensure the JSON is valid and contains NO markdown. The tasks should be actionable and specific (e.g., "Build a Todo App in React", "Complete Data Structures Module 1").
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate career roadmaps." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2048,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from Grok");
        }

        const roadmaps = JSON.parse(content);
        return NextResponse.json(roadmaps);
    } catch (error: any) {
        console.error("Career Roadmap API Error:", error);
        return NextResponse.json({
            error: "Failed to generate roadmaps",
            details: error.message || String(error)
        }, { status: 500 });
    }
}
