import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { userProfile, selectedPath } = await req.json();

        // 1. If selectedPath is provided, generate 3 TIMELINES (Fast-Track, Growth, Mastery)
        if (selectedPath) {
            const prompt = `
                You are an expert career strategist. The user has chosen the career path: "${selectedPath}".
                Their profile: ${JSON.stringify(userProfile)}.
                
                Generate 3 distinct roadmaps for this career path:
                1. "Fast-Track" (2 Months): Intense, crash-course style. Focus on MVPs and core skills.
                2. "Growth" (6 Months): Balanced, standard industry pace. Deep understanding.
                3. "Mastery" (1 Year): Academic depth, research, and advanced specializations.

                For EACH roadmap, provide:
                - "type": "fast_track" | "growth" | "mastery"
                - "duration": string
                - "total_xp": number (approx 1000-5000)
                - "milestones": Array of objects. Each object MUST have:
                    - "day": number (1, 2, 3...)
                    - "title": string (Node Title)
                    - "task": string (Brief description)
                    - "xp": number
                    - "status": "pending"
                    - "milestone_type": "Learning" | "Project" | "Quiz"
                    - "subtopics": string[] (3-5 items to learn)
                    - "resources": Array of { "title": string, "url": string } (2-3 items)
                - "description": High-level summary of this approach.

                Tone: Strategic and Mission-oriented.

                Return STRICT JSON format:
                {
                    "roadmaps": [
                        { ...fast_track_obj },
                        { ...growth_obj },
                        { ...mastery_obj }
                    ]
                }
            `;

            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
            });

            const logic = JSON.parse(completion.choices[0]?.message?.content || '{}');
            return NextResponse.json(logic);
        }

        // 2. If NO selectedPath, generate OPTIMAL CAREER OPTIONS (Discovery Phase)
        else {
            const prompt = `
                Analyze this student profile and suggest 4 optimal career paths.
                Profile: ${JSON.stringify(userProfile)}.

                Return STRICT JSON format:
                {
                    "options": [
                        {
                            "title": "Job Title",
                            "match_score": number (0-100),
                            "reason": "Why this fits their skills/GPA",
                            "market_outlook": "High/Medium/Low"
                        },
                        ... (4 options)
                    ]
                }
            `;

            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
            });

            const logic = JSON.parse(completion.choices[0]?.message?.content || '{}');
            return NextResponse.json(logic);
        }

    } catch (error) {
        console.error('Career Logic Error:', error);
        return NextResponse.json({ error: 'Failed to generate intelligence' }, { status: 500 });
    }
}
