
// src/lib/globalEligibilityEngine.ts

import { UnifiedProfile } from './profileBuilder';

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

export interface GlobalOpportunity {
    university: string;
    country: string;
    program: string;
    tuition: string;
    probability: number;
    requirements: string[];
}

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

    // Simple filtering logic based on profile if needed
    // For now, returning static mock data enhanced with types
    return opportunities;
}


export function generateIntelligence(profile: UnifiedProfile): IntelligenceOutput {
    // 1. Analyze Dominant Stream
    const topSub = profile.subjectStrength[0]?.subject || "General";
    let stream = "General";
    if (['Math', 'Physics', 'CS', 'Data'].some(s => topSub.includes(s))) stream = "STEM";
    else if (['Business', 'Account', 'Econ'].some(s => topSub.includes(s))) stream = "Commerce";
    else stream = "Arts/Humanities";

    // 2. Generate Paths
    const globalPaths: PathwayResult[] = [
        { country: "Germany", title: "M.Sc in Applied CS", type: 'Academic', probability: 85, roi: "Very High", cost: "Free", duration: "2 Years" },
        { country: "USA", title: "MS in Data Science", type: 'Academic', probability: 72, roi: "High", cost: "$60k", duration: "2 Years" },
        { country: "UK", title: "M.Eng Software", type: 'Academic', probability: 80, roi: "Medium", cost: "£25k", duration: "1 Year" },
    ];

    const indiaPaths: PathwayResult[] = [
        { country: "India", title: "Tech Lead @ PBC", type: 'Professional', probability: 90, roi: "High", cost: "0", duration: "Jobs" },
        { country: "India", title: "M.Tech / GATE", type: 'Academic', probability: 65, roi: "Medium", cost: "₹2L", duration: "2 Years" },
    ];

    // 3. Risk Analysis
    const riskLevel = profile.gpa > 3.0 ? 'Low' : 'Medium';
    const riskFactors = [];
    if (profile.gpa < 3.0) riskFactors.push("GPA below global average (3.0)");
    if (profile.entranceScores.length === 0) riskFactors.push("No standardized test scores detected");

    return {
        academicSummary: {
            dominantStream: stream,
            globalEquivalence: `US GPA ${(profile.gpa * 0.8 + 1).toFixed(1)} est.` // Dummy conversion formula
        },
        indiaPaths,
        globalPaths,
        careerRoles: ["Data Scientist", "System Architect", "Product Manager", "AI Researcher"],
        admissionProbability: {
            "USA": 65, "Germany": 82, "Canada": 78, "UK": 85
        },
        visaConfidence: {
            "USA": 70, "Germany": 92, "Canada": 88
        },
        roiForecast: {
            "USA": "$110k/yr", "Germany": "€65k/yr", "India": "₹28L/yr"
        },
        riskAnalysis: {
            level: riskLevel,
            factors: riskFactors
        },
        aiInsight: `Based on your strong performance in ${topSub}, you are highly suited for the German tuition-free pathway. Your profile shows a 'Low Risk' for Visa approval in EU countries.`
    };
}
