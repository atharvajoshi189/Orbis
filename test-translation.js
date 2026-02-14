
const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in Node 18+

async function testTranslation() {
    console.log("Testing Translation API...");
    try {
        const response = await fetch('http://localhost:3000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: "Hello World",
                targetLang: "es"
            })
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const data = await response.json();
        console.log("Success! Translated:", data);
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testTranslation();
