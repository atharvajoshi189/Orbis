require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Service Role Key or URL.");
    console.log("URL:", supabaseUrl ? "Found" : "Missing");
    console.log("Service Key:", serviceRoleKey ? "Found" : "Missing");
    console.log("⚠️ Cannot run Admin Test without Service Role Key.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function adminCreateUser() {
    const timestamp = Date.now();
    const email = `admin.test.${timestamp}@example.com`;
    const password = "TestPassword123!";
    const metadata = {
        first_name: "Admin",
        last_name: "Tester",
        phone: "9998887776",
        currentYear: "Final Year",
        pastRecords: "100%"
    };

    console.log(`🚀 Creating User via Admin API: ${email}`);

    // 1. Admin Create User
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm
        user_metadata: metadata
    });

    if (createError) {
        console.error("❌ Admin Creation Failed:", createError.message);
        return;
    }

    console.log("✅ Admin User Created. ID:", user.id);

    // 2. Wait for Trigger
    console.log("⏳ Waiting for Database Trigger...");
    await new Promise(r => setTimeout(r, 2000));

    // 3. Check Profile (using Service Role to bypass RLS if needed, though we read public)
    const { data: profile, error: profileError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error("❌ Profile Retrieval Failed:", profileError.message);
        console.error("CRITICAL: The Database Trigger failed even for Admin creation.");
    } else {
        console.log("✅ Student Profile Found:", profile);
        console.log("🎉 SUCCESS: Trigger Logic Verified via Admin API!");
    }
}

adminCreateUser();
