
import rulesData from '@/data/educationRules.json';

export interface StudentProfile {
    educationLevel: 'High School' | 'Diploma' | 'Bachelor\'s' | 'Master\'s';
    percentage10: number;
    percentage12: number;
    gpa?: number;
    stream: string; // Expanded list
    percentageSubjects: { [key: string]: number };
    targetCountries: string[];
}

export interface EligibilityResult {
    ruleId: string;
    careerName: string;
    isEligible: boolean;
    reasons: string[];
    admissionProbability: number;
    roi: string;
    visaProbability?: number;
    riskLevel: string;
    roadmap?: any;
}

const STREAM_MAPPING: { [key: string]: string } = {
    'Science (PCM)': 'Science',
    'Science (PCB)': 'Science',
    'Commerce': 'Commerce',
    'Arts': 'Arts',
    'Computer Science': 'Science',
    'Mechanical': 'Science',
    'Electrical': 'Science',
    'Civil': 'Science',
    'IT': 'Science',
    'Business': 'Commerce',
    'Finance': 'Commerce',
    'Humanities': 'Arts',
    'Psychology': 'Arts',
    'Design': 'Arts',
    'Law': 'Arts',
    'Medical': 'Science',
    'Biotechnology': 'Science',
    'AI & Data Science': 'Science',
    'Open / Undecided': 'Any'
};

export function analyzeEligibility(profile: StudentProfile): EligibilityResult[] {
    const results: EligibilityResult[] = [];
    const mappedStream = STREAM_MAPPING[profile.stream] || 'Any';

    for (const rule of rulesData) {
        // Filter by Country (if international)
        if ((rule as any).isInternational) {
            // Extract country from rule name/desc (Mock logic as rule doesn't have explicit country field)
            // Ideally educationRules.json should have a separate country field.
            // For now, looking for country name in rule name
            const ruleName = rule.name.toLowerCase();
            const relevantCountry = profile.targetCountries.find(c => ruleName.includes(c.toLowerCase()));

            if (!relevantCountry && profile.targetCountries.length > 0) continue;
        } else {
            // If local rule, maybe show it? For now, if profile has specific countries, focus on those.
            // Let's include local rules if 'India' is implicitly selected or always show.
            // User requirement: "Focus on global / abroad". 
            // We will include if matches country or is generic.
        }

        const reasons: string[] = [];
        let isEligible = true;

        // Check 10th Marks
        if (profile.percentage10 < rule.minPercentage10) {
            isEligible = false;
            reasons.push(`10th Grade Marks < ${rule.minPercentage10}%`);
        }

        // Check 12th Marks (Only if High School or Diploma)
        if (profile.educationLevel === 'High School' || profile.educationLevel === 'Diploma') {
            if (profile.percentage12 < rule.minPercentage12) {
                isEligible = false;
                reasons.push(`12th Grade Marks < ${rule.minPercentage12}%`);
            }
        }

        // Check Stream
        if (rule.requiredStream !== 'Any' && mappedStream !== rule.requiredStream && mappedStream !== 'Any') {
            isEligible = false;
            reasons.push(`Requires ${rule.requiredStream} background`);
        }

        // Check Subjects
        if (rule.requiredSubjects && rule.requiredSubjects.length > 0) {
            const missingSubjects = rule.requiredSubjects.filter(sub => {
                const score = profile.percentageSubjects[sub];
                return score === undefined || score < rule.minSubjectScore;
            });

            if (missingSubjects.length > 0) {
                isEligible = false;
                reasons.push(`Low/Missing scores in: ${missingSubjects.join(', ')}`);
            }
        }

        results.push({
            ruleId: rule.id,
            careerName: rule.name,
            isEligible,
            reasons,
            admissionProbability: rule.admissionProbBase,
            roi: rule.roi,
            visaProbability: (rule as any).isInternational ? (rule as any).visaProbBase : undefined,
            riskLevel: rule.riskLevel,
            roadmap: (rule as any).roadmap
        });
    }

    return results;
}
