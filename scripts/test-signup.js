require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Environment Variables. Please run with env vars loaded.");
    console.log("URL:", supabaseUrl ? "Found" : "Missing");
    console.log("Key:", supabaseKey ? "Found" : "Missing");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
    const timestamp = Date.now();
    const email = `beta.tester.${timestamp}@yahoo.com`; // Try Yahoo
    const password = "TestPassword123!";
    const metadata = {
        first_name: "Beta",
        last_name: "Tester",
        phone: "1234567890",
        currentYear: "12th",
        pastRecords: "90%"
    };

    console.log(`🚀 Starting Signup Test for: ${email}`);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
    });

    if (authError) {
        console.error("❌ Signup Failed:", authError.message);
        return;
    }

    if (!authData.user) {
        console.error("❌ No user returned!");
        return;
    }

    console.log("✅ Auth User Created. ID:", authData.user.id);

    // 2. Wait for Trigger (allow 2-3 seconds for DB propagation)
    console.log("⏳ Waiting for Database Trigger...");
    await new Promise(r => setTimeout(r, 3000));

    // 3. Check Profile
    const { data: profile, error: profileError } = await supabase
        .from('students')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        console.error("❌ Profile Retrieval Failed:", profileError.message);
        console.error("CRITICAL: The Database Trigger likely failed to execute.");
    } else {
        console.log("✅ Student Profile Found:", profile);
        console.log("🎉 SUCCESS: Signup Flow is working perfectly!");
    }
}

testSignup();
