-- Add columns for Counselor Admin features
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active', -- 'Active', 'Validation Pending', 'Validated', 'Urgent'
ADD COLUMN IF NOT EXISTS counselor_notes text,
ADD COLUMN IF NOT EXISTS budget integer DEFAULT 0;

-- Add Index for status filtering
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
