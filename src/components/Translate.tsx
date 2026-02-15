"use client";

import { useAppStore } from "@/lib/store";
import { translateText } from "@/lib/grokTranslator";
import { useEffect, useState } from "react";

// Simple cache to prevent excessive API calls
const translationCache: Record<string, string> = {};

export default function Translate({ text, className }: { text: string, className?: string }) {
    const { language } = useAppStore();
    const [translated, setTranslated] = useState(text);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (language === 'en') {
            setTranslated(text);
            return;
        }


        const cacheKey = `${language}:${text}`;

        // Check localStorage first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            setTranslated(cached);
            return;
        }

        // Check memory cache
        if (translationCache[cacheKey]) {
            setTranslated(translationCache[cacheKey]);
            localStorage.setItem(cacheKey, translationCache[cacheKey]);
            return;
        }

        const fetchTranslation = async () => {
            setIsLoading(true);
            try {
                const res = await translateText(text, language);
                translationCache[cacheKey] = res;
                localStorage.setItem(cacheKey, res); // Persist to localStorage
                setTranslated(res);
            } catch (err) {
                console.error(err);
                setTranslated(text); // Fallback
            } finally {
                setIsLoading(false);
            }
        }

        fetchTranslation();
    }, [language, text]);

    return (
        <span className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            {translated}
        </span>
    );
}
