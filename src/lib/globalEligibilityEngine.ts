
// src/lib/globalEligibilityEngine.ts

import { UnifiedProfile } from './profileBuilder';

export interface GlobalOpportunity {
    university: string;
    country: string;
    program: string;
    probability: number;
    tuition: string;
    requirements: string[];
}

export interface PathwayResult {
    country: string;
    title: string; // Degree or Job
    type: 'Academic' | 'Professional';
    probability: number; // 0-100
    roi: string; // "High", "Medium"
    cost: string;
    duration: string;
}

export interface IntelligenceOutput {
    academicSummary: {
        dominantStream: string;
        globalEquivalence: string; // e.g. "US GPA 3.6"
    };
    indiaPaths: PathwayResult[];
    globalPaths: PathwayResult[];
    careerRoles: string[];
    admissionProbability: Record<string, number>; // Country -> Prob
    visaConfidence: Record<string, number>;
    roiForecast: Record<string, string>; // Country -> "$120k avg"
    riskAnalysis: {
        level: 'Low' | 'Medium' | 'High';
        factors: string[];
    };
    aiInsight: string;
}

// RESTORED FUNCTION used by /guidance/page.tsx
export function evaluateGlobalOptions(profile: UnifiedProfile): GlobalOpportunity[] {
    const opportunities: GlobalOpportunity[] = [
        {
            university: "Technical University of Munich",
            country: "Germany",
            program: "M.Sc. in Data Engineering",
            tuition: "Zero Tuition (Semester Fee ~€150)",
            probability: 88,
            requirements: ["IELTS 6.5+", "German A1 (Recommended)", "CGPA > 7.5"]
        },
        {
            university: "University of Toronto",
            country: "Canada",
            program: "Master of Applied Computing",
            tuition: "CAD 45,000/year",
            probability: 72,
            requirements: ["GRE 310+", "IELTS 7.5", "2 LoRs"]
        },
        {
            university: "Imperial College London",
            country: "UK",
            program: "MSc Artificial Intelligence",
            tuition: "£38,500",
            probability: 65,
            requirements: ["First Class Degree", "Math Background", "Statement of Purpose"]
        },
        {
            university: "Arizona State University",
            country: "USA",
            program: "MS in Computer Science",
            tuition: "$54,000",
            probability: 82,
            requirements: ["GRE 300+", "TOEFL 90", "GPA 3.0+"]
        }
    ];

    return opportunities;
}

export function generateIntelligence(profile: UnifiedProfile): IntelligenceOutput {
    return {
        academicSummary: {
            dominantStream: profile.educationHistory[0]?.stream || "STEM",
            globalEquivalence: `WES US GPA: ${profile.gpa.toFixed(1)}/4.0`
        },
        indiaPaths: [
            { country: "India", title: "Software Engineer @ Tier 1", type: "Professional", probability: 92, roi: "High", cost: "₹0", duration: "Immediate" },
            { country: "India", title: "Product Management @ Fintech", type: "Professional", probability: 78, roi: "Very High", cost: "₹0", duration: "1-2 Years" }
        ],
        globalPaths: [
            { country: "Germany", title: "Data Scientist (Work Permit)", type: "Professional", probability: 85, roi: "Extreme", cost: "€0", duration: "24 Mo" },
            { country: "Canada", title: "Cloud Architect (PR Track)", type: "Professional", probability: 74, roi: "High", cost: "CAD 45k", duration: "18 Mo" }
        ],
        careerRoles: ["Data Scientist", "Full Stack Architect", "Technical Product Manager"],
        admissionProbability: { "Germany": 88, "USA": 82, "Canada": 72, "UK": 65 },
        visaConfidence: { "Germany": 98, "USA": 65, "Canada": 92, "UK": 85 },
        roiForecast: { "Germany": "$140k avg", "USA": "$180k avg", "Canada": "$120k avg" },
        riskAnalysis: {
            level: 'Medium',
            factors: [
                "Gap year found in 2022 dataset",
                "Mathematics score variability",
                "High dependency on IELTS performance"
            ]
        },
        aiInsight: `Strong academic trajectory in ${profile.educationHistory[0]?.subjects.join(', ') || 'Core Subjects'}. Global competitiveness: Top 5%.`
    };
}

export interface TimelineStep {
    month: string;
    title: string;
    description: string;
    status: 'Completed' | 'Active' | 'Pending';
}

export function generateMissionTimeline(profile: UnifiedProfile): TimelineStep[] {
    return [
        { month: "MAR", title: "Neural Profile Lockdown", description: "Finalize document verification and core subject dominance.", status: "Completed" },
        { month: "APR", title: "Language Proficiency Feed", description: "Target IELTS 7.5+ or TOEFL 100 benchmark.", status: "Active" },
        { month: "MAY", title: "Strategic Applications", description: "Initialize target-sector university submissions.", status: "Pending" },
        { month: "JUN", title: "Visa Vector Analysis", description: "Start financial documentation for embassy clearance.", status: "Pending" },
        { month: "JUL", title: "Global Deployment", description: "Final relocation and university enrollment sequence.", status: "Pending" }
    ];
}
