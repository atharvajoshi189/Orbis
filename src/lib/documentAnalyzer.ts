
// src/lib/documentAnalyzer.ts

export interface ExtractedData {
    fileName: string;
    docType: 'Marksheet' | 'Transcript' | 'Certificate' | 'ScoreCard' | 'Unknown';
    rawText: string;
    confidenceScore: number;
    entities: {
        studentName?: string;
        institution?: string;
        allStars?: boolean; // internal mock flag
        year?: number;
        educationLevel?: '10th' | '12th' | 'Bachelor' | 'Master' | 'Diploma' | 'PhD';
        stream?: string; // e.g., "Science", "Commerce", "CS"
        gpa?: number;
        percentage?: number;
        subjects: Record<string, number>;
    };
}

export async function analyzeDocument(file: File): Promise<ExtractedData> {
    // Simulate OCR delay (random between 1-2s)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const nameLower = file.name.toLowerCase();

    // Mock Recognition Logic
    let docType: ExtractedData['docType'] = 'Unknown';
    let educationLevel: ExtractedData['entities']['educationLevel'] = undefined;

    if (nameLower.includes('10')) { docType = 'Marksheet'; educationLevel = '10th'; }
    else if (nameLower.includes('12')) { docType = 'Marksheet'; educationLevel = '12th'; }
    else if (nameLower.includes('bachelor') || nameLower.includes('degree') || nameLower.includes('btech')) { docType = 'Transcript'; educationLevel = 'Bachelor'; }
    else if (nameLower.includes('master') || nameLower.includes('ms')) { docType = 'Transcript'; educationLevel = 'Master'; }
    else if (nameLower.includes('ielts') || nameLower.includes('toefl') || nameLower.includes('sat')) { docType = 'ScoreCard'; }
    else { docType = 'Certificate'; }

    // Mock Data Generation
    const isScience = Math.random() > 0.3; // 70% chance of Science stream for demo

    return {
        fileName: file.name,
        docType,
        rawText: `[MOCK OCR OUTPUT FOR ${file.name}]`,
        confidenceScore: 0.85 + Math.random() * 0.14,
        entities: {
            studentName: "Alex Doe",
            institution: "Greenwood High / Metropolis Tech",
            year: 2020 + Math.floor(Math.random() * 4),
            educationLevel,
            stream: isScience ? "Science (PCM)" : "Commerce",
            percentage: 75 + Math.floor(Math.random() * 20),
            gpa: 7 + Math.random() * 3,
            subjects: educationLevel === '10th' ? {
                "Mathematics": 85, "Science": 82, "English": 78, "Social Studies": 90
            } : educationLevel === '12th' ? {
                "Physics": 78, "Chemistry": 85, "Math": 92, "English": 88, "CS": 95
            } : {
                "Data Structures": 88, "Algorithms": 75, "Database": 82, "OS": 79
            }
        }
    };
}
