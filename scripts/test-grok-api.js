const fetch = require('node-fetch');

async function testGrokAPI() {
    const mockProfile = {
        name: "Beta Tester",
        marks_10th: "95%",
        marks_12th: "92%",
        skills: ["React", "Python", "Data Analysis"],
        interests: ["AI", "Robotics"],
        strengths: ["Logic", "Coding"],
        weaknesses: ["Public Speaking"]
    };

    console.log("🚀 Initiating Beta Test for Grok Dashboard API...");
    console.log("📤 Sending Mock Profile:", mockProfile);

    try {
        const response = await fetch('http://localhost:3000/api/grok-dashboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: mockProfile })
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Grok Response Received!");
        console.log("📊 Dashboard Data Generated:\n", JSON.stringify(data, null, 2));

        // Basic Validation
        if (data.skill_gaps && data.deadlines && data.daily_intel) {
            console.log("\n✨ TEST PASSED: Structure is valid.");
        } else {
            console.error("\n⚠️ TEST FAILED: Missing required keys in JSON.");
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        console.log("Note: Ensure the Next.js server is running on localhost:3000");
    }
}

testGrokAPI();
