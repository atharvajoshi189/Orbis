const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function test() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const apiKey = envContent.match(/GEMINI_API_KEY=(.*)/)[1].trim();
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Testing gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello 2.0 Flash");
        console.log("Success! Response:", result.response.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
