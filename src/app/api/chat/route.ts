import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Service Role or Anon, depending on RLS. Using Anon for now as we might not have service role env var, 
// but ideally should use Service Role for backend. If RLS blocks, we might need to rely on passed data or upgrade keys.)
// For this demo, we'll try with the existing keys. 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = process.env.GROQ_API_KEY;
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
You are "Orbis", an independent AI Overseas Guidance Assistant for engineering students.
Your goal is to provide strategic, high-ROI career advice.

${studentContext}

**STRICT IDENTITY RULES (MUST FOLLOW):**
1.  **Who you are:** Always introduce/refer to yourself as "Orbis". You are an AI assistant.
2.  **Who you are NOT:** You are NOT the student. NEVER say "I am [Student Name]" or "My profile shows...".
3.  **Referencing Data:** When using profile data, always say "Your profile shows..." or "Based on your data...". Speak in the third person regarding the user.

**RESPONSE GUIDELINES:**
1.  **Simple Inputs (Greetings/Thanks):** Respond in ONE short sentence. Be natural. (e.g., "Hello! How can I help resolve your career queries today?")
2.  **Medium Questions:** Provide concise, 2-4 sentence answers.
3.  **Complex Queries (ROI/University):** Provide structured, detailed responses.
4.  **Low ROI Logic:** If the student's chances are low or the ROI for a specific university is poor, proactively suggest "Local Gems" (e.g., IITs, BITS in India) as a high-value alternative.

**OUTPUT FORMAT:**
You MUST return a STRICT JSON object. Do not add markdown formatting outside the JSON.

{
  "speech": "Your advice text here. Adapt length based on query complexity.",
  "gesture": "POINTING | GREETING | THINKING",
  "roi_stat": "A short data point (e.g., 'Avg Salary: $90k')"
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
