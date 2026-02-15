import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Groq Client
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.warn("GROQ_API_KEY is not set.");
        return null;
    }
    return new Groq({ apiKey });
};

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { targetCountry, userBudget, userId } = await req.json();

        if (!targetCountry || !userBudget) {
            return NextResponse.json(
                { error: "Target country and budget are required." },
                { status: 400 }
            );
        }

        const groq = getGroqClient();
        if (!groq) {
            return NextResponse.json(
                { error: "Service unavailable (API Key Missing)" },
                { status: 503 }
            );
        }

        const systemPrompt = `You are a Financial Career Strategist for 'Orbis'.
Analyze the student's target: ${targetCountry} and budget: ${userBudget}.
If target is over budget (approx 20% buffer), recommend a cheaper alternative with similar academic quality.

Return a breakdown in STRICT JSON format:
{
  "original": { 
      "tuition": NUMBER (yearly tuition in USD), 
      "rent": NUMBER (yearly rent in USD), 
      "food": NUMBER (yearly food in USD), 
      "total": NUMBER (yearly total in USD)
  },
  "alternative": { 
      "country": "Alternative Country Name (or null if original is fine)", 
      "tuition": NUMBER, 
      "rent": NUMBER, 
      "total": NUMBER, 
      "reason": "Why this is a better fit financially/academically" 
  },
  "roi_percentage": "PERCENTAGE STRING (e.g. '150%')",
  "break_even_months": NUMBER (months to pay back loan/cost based on avg starting salary),
  "starting_salary": NUMBER (avg starting salary in USD),
  "risk_score": NUMBER (0-100, where 100 is high risk),
  "analysis_text": "Brief strategic advice (max 2 sentences)."
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze ROI for studying in ${targetCountry} with a budget of ${userBudget}.` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from Grok");
        }

        const analysisData = JSON.parse(content);

        // Data Persistence
        const { error: dbError } = await supabase
            .from('roi_simulations')
            .insert([
                {
                    user_id: userId || null, // Optional if user not logged in
                    target_country: targetCountry,
                    budget: userBudget,
                    analysis_json: analysisData
                }
            ]);

        if (dbError) {
            console.error("Supabase Save Error:", dbError);
            // We don't fail the request if saving fails, but we log it.
        }

        return NextResponse.json(analysisData);

    } catch (error) {
        console.error("ROI Analysis API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate ROI analysis" },
            { status: 500 }
        );
    }
}
