
// src/lib/careerMappingEngine.ts

import { UnifiedProfile } from './profileBuilder';

export interface CareerPath {
    title: string;
    matchScore: number;
    description: string;
    reasoning: string[];
    salaryRange: string;
    jobOutlook: 'Growing' | 'Stable' | 'Declining';
    skillsGap: string[];
}

export interface ProfessionalRole {
    title: string;
    industry: string;
    skillsMatches: string[];
    skillsMissing: string[];
    avgSalary: string;
}

// RESTORED FUNCTION used by /guidance/page.tsx
export function generateCareerMap(profile: UnifiedProfile): CareerPath[] {
    const paths: CareerPath[] = [];

    // Helper to safely get subject score
    const getScore = (sub: string) => {
        // Check subjectStrength array or aggregated subjects in history (not easily available in simplified UnifiedProfile, using subjectStrength)
        const match = profile.subjectStrength.find(s => s.subject.includes(sub));
        return match ? match.score : 0;
    };

    const math = getScore('Math');
    const cs = getScore('Computer') || getScore('CS') || getScore('Technology');
    const physics = getScore('Physics');

    if (math > 80 && cs > 80) {
        paths.push({
            title: "AI Research Scientist",
            matchScore: 96,
            description: "Develop new algorithms and models for artificial intelligence.",
            reasoning: ["Strong Mathematics base", "High proficiency in CS"],
            salaryRange: "$120k - $200k",
            jobOutlook: 'Growing',
            skillsGap: ["Python", "TensorFlow", "Linear Algebra"]
        });
    }

    if (physics > 80 && math > 80) {
        paths.push({
            title: "Robotics Engineer",
            matchScore: 88,
            description: "Design and build autonomous robotic systems.",
            reasoning: ["Strong Physics application", "Mathematical modeling skills"],
            salaryRange: "$90k - $150k",
            jobOutlook: 'Growing',
            skillsGap: ["ROS", "C++", "Control Systems"]
        });
    }

    // Default path
    paths.push({
        title: "Software Developer",
        matchScore: 85,
        description: "Build scalable web and mobile applications.",
        reasoning: ["Good logical reasoning", "Technical aptitude"],
        salaryRange: "$80k - $130k",
        jobOutlook: 'Stable',
        skillsGap: ["React", "Node.js", "System Design"]
    });

    return paths;
}

// NEW FUNCTION used by /career-path/page.tsx (potentially, or just available for future)
export function analyzeProfessionalFit(profile: UnifiedProfile): ProfessionalRole[] {
    return [
        {
            title: "Full Stack Developer",
            industry: "Tech",
            skillsMatches: ["React", "Node.js (inferred)"],
            skillsMissing: ["Docker", "Kubernetes"],
            avgSalary: "$95,000"
        },
        {
            title: "Data Analyst",
            industry: "Finance/Tech",
            skillsMatches: ["Math", "Statistics"],
            skillsMissing: ["Python", "SQL"],
            avgSalary: "$85,000"
        }
    ];
}
