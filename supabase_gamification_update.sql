-- Add Gamification columns
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS completed_missions text[] DEFAULT '{}';

-- Optional: Create a separate table for available missions if we want to manage them dynamically
-- For now, we'll keep missions hardcoded in frontend or jsonb, and just track completed_ids here.
