const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
let envConfig = {};
try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const firstEq = line.indexOf('=');
        if (firstEq > 0) {
            const key = line.substring(0, firstEq).trim();
            const value = line.substring(firstEq + 1).trim();
            if (key && value) {
                envConfig[key] = value;
            }
        }
    });
} catch (e) {
    console.error("Could not read .env.local", e);
    process.exit(1);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key in .env.local");
    process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase Key (truncated): ${supabaseKey.substring(0, 10)}...${supabaseKey.substring(supabaseKey.length - 10)}`);

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false // For scripts, disable session storage
    }
});

async function verifySignup() {
    // Precise user test
    const timestamp = Date.now();
    const email = 'joshiatharva063@gmail.com';
    const password = 'TestPassword123!';
    const metaData = {
        full_name: 'Atharva Joshi',
        phone: '1234567890',
        gpa: '3.8',
        current_year: 'Undergrad',
        major: 'Computer Science',
        target_country: 'USA',
        career_goal: 'AI Engineer',
        past_records: 'None'
    };

    console.log(`\nAttempting specify signup...`);
    console.log(`Email: "${email}" (Length: ${email.length})`);
    console.log(`Password: "${password}"`);
    console.log(`Metadata:`, JSON.stringify(metaData));

    try {
        // 1. Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metaData
            }
        });

        if (authError) {
            console.error("\n❌ Signup Failed:", authError.message);
            if (authError.message.includes("fetch failed")) {
                console.error("Diagnosis: This is likely a network issue reaching Supabase. Check user URL or proxy.");
            }
            return;
        }

        if (!authData.user) {
            console.error("\n❌ Signup succeeded but no user returned. This often happens if 'Confirm Email' is enabled in Supabase Auth Settings but you haven't verified.");
            console.log("For testing, disable 'Confirm Email' in Supabase -> Authentication -> Providers -> Email.");
            return;
        }

        console.log("✅ User created in Auth:", authData.user.id);
        console.log("Waiting for Database Trigger to replicate user to 'public.students'...");

        // Wait for trigger to fire (async)
        await new Promise(resolve => setTimeout(resolve, 4000));

        // 2. Verify Profile in 'public.students'
        const { data: profile, error: profileError } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

        if (profileError) {
            console.error("\n❌ Profile Verification Failed:", profileError.message);
            console.log("Explanation: The 'students' table might not exist or the trigger 'on_auth_user_created' failed.");
            console.log("Action Required: Please run the 'supabase_schema.sql' script in your Supabase SQL Editor if you haven't yet.");
        } else if (profile) {
            console.log("\nSUCCESS! Student Profile Created:", profile);
            console.log("Flow Verified: Auth Signup -> Trigger -> Database Insert");
        } else {
            console.error("\n❌ Profile not found (no error, but no data). Weird state.");
        }

    } catch (err) {
        console.error("\n❌ Unexpected Error:", err);
    }
}

verifySignup();
