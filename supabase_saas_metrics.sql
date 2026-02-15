-- Existing Tables (Keep these if they exist, or create if not)

-- 1. SaaS Expansion: B2B Lead Scoring
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS convertibility_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'cold', -- 'cold', 'warm', 'hot'
ADD COLUMN IF NOT EXISTS dream_university TEXT,
ADD COLUMN IF NOT EXISTS target_country TEXT;

-- 2. SaaS Expansion: Daily Intel Feed
CREATE TABLE IF NOT EXISTS news_feed (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    category TEXT CHECK (category IN ('visa', 'scholarship', 'tech', 'general')),
    target_stream TEXT, -- e.g., 'Computer Science', 'Finance'
    source_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on News Feed
ALTER TABLE news_feed ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public News Access" ON news_feed
    FOR SELECT USING (true);

-- Allow write access only to service role (AI Agent)
-- (In Supabase dashboard, you can just use the API)
