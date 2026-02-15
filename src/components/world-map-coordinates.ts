// Initial coordinate mapping for key countries in the 1009x650 SVG viewbox context
// These are approximate percentages (x, y) based on the standard Robinson/Mercator-ish projection usually found in SVGs.

export const COUNTRY_COORDINATES: Record<string, { x: number, y: number, region?: string }> = {
    // North America
    "USA": { x: 22, y: 35, region: "North America" },
    "United States": { x: 22, y: 35, region: "North America" },
    "Canada": { x: 20, y: 25, region: "North America" },
    "Mexico": { x: 20, y: 45, region: "North America" },

    // South America
    "Brazil": { x: 32, y: 65, region: "South America" },
    "Argentina": { x: 28, y: 80, region: "South America" },

    // Europe
    "United Kingdom": { x: 46, y: 28, region: "Europe" },
    "UK": { x: 46, y: 28, region: "Europe" },
    "Germany": { x: 50, y: 30, region: "Europe" },
    "France": { x: 48, y: 32, region: "Europe" },
    "Italy": { x: 51, y: 34, region: "Europe" },
    "Spain": { x: 47, y: 35, region: "Europe" },
    "Netherlands": { x: 49, y: 29, region: "Europe" },
    "Switzerland": { x: 50, y: 32, region: "Europe" },
    "Ireland": { x: 45, y: 28, region: "Europe" },
    "Sweden": { x: 52, y: 20, region: "Europe" },
    "Norway": { x: 50, y: 20, region: "Europe" },
    "Poland": { x: 53, y: 30, region: "Europe" },

    // Asia
    "India": { x: 68, y: 45, region: "Asia" },
    "China": { x: 75, y: 38, region: "Asia" },
    "Japan": { x: 86, y: 38, region: "Asia" },
    "South Korea": { x: 82, y: 38, region: "Asia" },
    "Singapore": { x: 76, y: 58, region: "Asia" },
    "Taiwan": { x: 80, y: 42, region: "Asia" },
    "Indonesia": { x: 78, y: 62, region: "Asia" },
    "Philippines": { x: 82, y: 55, region: "Asia" },

    // Oceania
    "Australia": { x: 85, y: 75, region: "Oceania" },
    "New Zealand": { x: 92, y: 85, region: "Oceania" },

    // Middle East
    "UAE": { x: 60, y: 45, region: "Middle East" },
    "Saudi Arabia": { x: 58, y: 45, region: "Middle East" },
    "Türkiye": { x: 56, y: 37, region: "Middle East" }, // Turkey

    // Africa
    "South Africa": { x: 52, y: 80, region: "Africa" },
    "Egypt": { x: 54, y: 42, region: "Africa" },
    "Nigeria": { x: 48, y: 55, region: "Africa" },
    "Kenya": { x: 56, y: 60, region: "Africa" },
};

// Growth trends for narration
export const GLOBAL_TRENDS: Record<string, string> = {
    "Germany": "Germany maintains a tuition-free model for public universities, seeing a 15% rise in Indian applicants.",
    "USA": "The US remains the top destination for STEM, with expanded OPT for STEM graduates.",
    "United Kingdom": "The UK's Graduate Route visa continues to attract students, despite recent policy reviews.",
    "Canada": "Canada offers strong PR pathways, though recent cap limits require higher strategic planning.",
    "Australia": "Australia has increased minimum savings requirements but offers extended post-study work rights for select degrees.",
    "Ireland": "Ireland is emerging as a tech hub with a 2-year stay-back option for postgraduates.",
    "Japan": "Japan is actively recruiting international talent to combat demographic decline, offering generous scholarships.",
    "default": "Global mobility is increasing, with a focus on STEM and high-demand skills."
};
