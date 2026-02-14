
// src/lib/grokTranslator.ts

export async function translateText(text: string, targetLang: string): Promise<string> {
    if (targetLang === 'en') return text;
    if (!text.trim()) return text;

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, targetLang })
        });

        if (!response.ok) {
            console.error(`Translation API failed: ${response.statusText}`);
            return text;
        }

        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Translation Service Failed:", error);
        return text;
    }
}
