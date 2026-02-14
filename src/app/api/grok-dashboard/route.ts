import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { profile } = await req.json();

        if (!profile) {
            return NextResponse.json({ error: "Profile data required" }, { status: 400 });
        }

        const systemPrompt = `
        You are the "Orbis Strategic Command AI". Analyze the operative's profile and generate a JSON dashboard.
        
        **Operative Profile:**
        - Name: ${profile.name}
        - 10th Marks: ${profile.marks_10th}
        - 12th Marks: ${profile.marks_12th}
        - Skills: ${profile.skills?.join(", ")}
        - Interests: ${profile.interests?.join(", ")}
        - Strengths: ${profile.strengths?.join(", ")}
        - Weaknesses: ${profile.weaknesses?.join(", ")}

        **Output Format (Strict JSON):**
        {
            "confidence_score": NUMBER (0-100), // Rate your confidence in this analysis based on profile completeness. < 70% if key fields (marks, skills) are missing.
            "human_review_needed": BOOLEAN, // Set to TRUE if confidence_score < 70 or if the profile seems contradictory/unrealistic.
            "skill_gaps": [
                { "name": "Skill Name", "you": NUMBER (0-100), "market": NUMBER (0-100) } 
                // Generate 4 relevant skills. If user has them, give high 'you' score. If missing but relevant to their interests, give low 'you' score and high 'market' score.
            ],
            "deadlines": [
                { "title": "Goal Title", "date": "Date String", "time": "Time String", "urgent": BOOLEAN }
                // Generate 3 realistic deadlines/goals based on their profile (e.g., "GRE Prep", "Internship App").
            ],
            "daily_intel": {
                "title": "Headline",
                "content": "Short insight relevant to their interests/skills (max 20 words)."
            },
            "radar_analysis": [
                { "subject": "CGPA", "A": NUMBER, "fullMark": 150 },
                { "subject": "Skills", "A": NUMBER, "fullMark": 150 },
                { "subject": "Exp", "A": NUMBER, "fullMark": 150 },
                { "subject": "Extra", "A": NUMBER, "fullMark": 150 },
                { "subject": "Logic", "A": NUMBER, "fullMark": 150 },
                { "subject": "Comm", "A": NUMBER, "fullMark": 150 }
            ]
        }
        
        Ensure the JSON is valid and contains NO markdown formatting or explanations. Just the JSON.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate dashboard analysis." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from Grok");
        }

        const dashboardData = JSON.parse(content);
        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Grok Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
    }
}
