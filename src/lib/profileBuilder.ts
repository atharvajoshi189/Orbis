
// src/lib/profileBuilder.ts

import { ExtractedData } from './documentAnalyzer';

export interface EducationRecord {
    level: string;
    institution: string;
    year: number;
    score: string; // "85%" or "3.8 GPA"
    stream: string;
    subjects: string[];
}

export interface UnifiedProfile {
    personal: {
        name: string;
        email?: string; // extracted or user
    };
    educationHistory: EducationRecord[];
    subjectStrength: { subject: string; score: number }[];
    gpa: number; // Aggregate or latest
    certifications: string[];
    entranceScores: { exam: string; score: string }[];
}

export function buildProfileFromDocuments(docs: ExtractedData[]): UnifiedProfile {
    const profile: UnifiedProfile = {
        personal: { name: "User" },
        educationHistory: [],
        subjectStrength: [],
        gpa: 0,
        certifications: [],
        entranceScores: []
    };

    let totalGpa = 0;
    let gpaCount = 0;
    const subjectMap: Record<string, number[]> = {};

    docs.forEach(doc => {
        const date = doc.entities;

        // 1. Build Education History
        if (date.educationLevel) {
            profile.educationHistory.push({
                level: date.educationLevel,
                institution: date.institution || "Unknown Institute",
                year: date.year || 2023,
                score: date.gpa ? `${date.gpa.toFixed(1)} GPA` : `${date.percentage}%`,
                stream: date.stream || "General",
                subjects: Object.keys(date.subjects)
            });

            // Gpa Aggregation
            if (date.gpa) {
                totalGpa += date.gpa;
                gpaCount++;
            } else if (date.percentage) {
                // Crude conversion: % / 20 - 1 approx or just %/10 ? Let's say / 10 - 0.5
                totalGpa += (date.percentage / 20);
                gpaCount++;
            }
        }

        // 2. Aggregate Subjects
        if (date.subjects) {
            Object.entries(date.subjects).forEach(([sub, score]) => {
                if (!subjectMap[sub]) subjectMap[sub] = [];
                subjectMap[sub].push(score);
            });
        }

        // 3. Extrance/Certs
        if (doc.docType === 'ScoreCard') {
            const name = doc.fileName.replace(/\.[^/.]+$/, "").toUpperCase(); // remove extension
            profile.entranceScores.push({
                exam: name.includes("IELTS") ? "IELTS" : name,
                score: "Detected" // Mock
            });
        }
        if (doc.docType === 'Certificate') {
            profile.certifications.push(doc.fileName.replace(/\.[^/.]+$/, ""));
        }
    });

    // Finalize Stats
    profile.gpa = gpaCount > 0 ? Number((totalGpa / gpaCount).toFixed(2)) : 0;

    // Top 5 strong subjects
    profile.subjectStrength = Object.entries(subjectMap)
        .map(([sub, scores]) => ({
            subject: sub,
            score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    // Sort history by year/level
    const levelOrder = { '10th': 1, '12th': 2, 'Diploma': 2, 'Bachelor': 3, 'Master': 4, 'PhD': 5 };
    profile.educationHistory.sort((a, b) => (levelOrder[b.level as keyof typeof levelOrder] || 0) - (levelOrder[a.level as keyof typeof levelOrder] || 0));

    return profile;
}
