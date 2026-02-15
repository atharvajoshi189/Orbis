import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.warn("GROQ_API_KEY is not set. Dashboard insights will be unavailable.");
        return null;
    }
    return new Groq({ apiKey });
};

export async function POST(req: Request) {
    try {
        const { profile, language = 'en' } = await req.json();

        if (!profile) {
            return NextResponse.json({ error: "Profile data required" }, { status: 400 });
        }

        const groq = getGroqClient();
        if (!groq) {
            return NextResponse.json({ error: "Service unavailable (API Key Missing)" }, { status: 503 });
        }

        const systemPrompt = `
        You are the "Orbis Strategic Command AI". Analyze the operative's profile and generate a JSON dashboard.
        
        **IMPORTANT: Output the content in this language: ${language} (ISO Code).**
        If the language is 'en', use English. If 'hi', use Hindi. If 'zh', use Chinese, etc.
        Keep names of programming languages (Java, Python) and technical terms (CGPA, ROI) in English if common in that language.

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
            "confidence_score": NUMBER (0-100), 
            "human_review_needed": BOOLEAN, 
            "skill_gaps": [
                { "name": "Skill Name", "you": NUMBER, "market": NUMBER } 
            ],
            "deadlines": [
                { "title": "Goal Title (Translated)", "date": "Date String", "time": "Time", "urgent": BOOLEAN }
            ],
            "daily_intel": {
                "title": "Headline (Translated)",
                "content": "Short insight (Translated)"
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
        
        Ensure the JSON is valid.
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
