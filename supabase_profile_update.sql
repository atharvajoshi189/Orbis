-- Add new columns for detailed student profile
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS interests text[],
ADD COLUMN IF NOT EXISTS marks_10th text,
ADD COLUMN IF NOT EXISTS marks_12th text,
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS strengths text[],
ADD COLUMN IF NOT EXISTS weaknesses text[];

-- Performance Index for Dashboard Lookups
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);

-- Verify columns (optional, just select to check)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students';
