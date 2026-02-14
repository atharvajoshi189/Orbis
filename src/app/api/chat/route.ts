import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Service Role or Anon, depending on RLS. Using Anon for now as we might not have service role env var, 
// but ideally should use Service Role for backend. If RLS blocks, we might need to rely on passed data or upgrade keys.)
// For this demo, we'll try with the existing keys. 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = process.env.GROK_API_KEY;
const groq = new Groq({ apiKey: apiKey || "dummy_key" });

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
    }

    try {
        const { messages, userId } = await req.json();

        // 1. Fetch Student Context from Supabase
        let studentContext = "";
        if (userId) {
            const { data: student, error } = await supabase
                .from('students')
                .select('gpa, major, career_goal, target_country, current_year')
                .eq('user_id', userId)
                .single();

            if (student && !error) {
                studentContext = `
STUDENT PROFILE:
- GPA: ${student.gpa || "Unknown"}
- Major: ${student.major || "Undecided"}
- Current Year: ${student.current_year || "Unknown"}
- Target Country: ${student.target_country || "Any"}
- Career Goal: ${student.career_goal || "General Engineering"}
`;
            }
        }

        // 2. Construct System Prompt with Business Logic
        const systemPrompt = `
You are "Orbis", a Senior Overseas Consultant.
Your goal is to provide strategic, high-ROI career advice to engineering students.

${studentContext}

**CORE INSTRUCTIONS:**
1.  **Persona:** Act like a seasoned, professional consultant. Be encouraging but realistic.
2.  **Context Aware:** Use the Student Profile above to tailor your advice.
3.  **Low ROI Logic:** If the student's chances are low or the ROI for a specific unversity is poor, proactively suggest "Local Gems" (e.g., IITs, BITS in India) as a high-value alternative.
4.  **Format:** You MUST return a STRICT JSON object. Do not add markdown formatting outside the JSON.

**JSON OUTPUT FORMAT:**
{
  "speech": "Your advice text here (keep it punchy, max 3 sentences).",
  "gesture": "POINTING | GREETING | THINKING",
  "roi_stat": "A short data point (e.g., 'Avg Salary: $90k', 'Visa Chance: 85%')"
}
`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 1024,
            response_format: { type: "json_object" } // Enforce JSON mode
        });

        // Parse JSON content to ensure validity before returning
        const content = completion.choices[0].message.content;
        let parsedContent;
        try {
            parsedContent = JSON.parse(content || "{}");
        } catch (e) {
            // Fallback if model fails to output valid JSON
            parsedContent = {
                speech: content || "I have analyzed your profile.",
                gesture: "THINKING",
                roi_stat: "Analysis Complete"
            };
        }

        return NextResponse.json(parsedContent);

    } catch (error: any) {
        console.error("Error in Chat API:", error);
        return NextResponse.json({ error: "Failed to process chat request", details: error.message }, { status: 500 });
    }
}
