
import { NextResponse } from 'next/server';

const GROK_API_KEY = process.env.GROK_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: Request) {
    console.log("Translation API hit");
    if (!GROK_API_KEY) {
        console.error("Translation API Error: Missing GROK_API_KEY");
        return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    try {
        const { text, targetLang } = await request.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Using a stable, versatile model
                messages: [
                    {
                        role: "system",
                        content: `You are a professional translator. Translate the following text into ${targetLang}. Return ONLY the translated text. Do not include any explanations, quotes, or additional text.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.1, // Lower temperature for more deterministic translations
                max_tokens: 256
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Groq Upstream Error:", data.error);
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        const translatedText = data.choices[0]?.message?.content?.trim() || text;
        return NextResponse.json({ translatedText });

    } catch (error) {
        console.error("Translation Internal Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
