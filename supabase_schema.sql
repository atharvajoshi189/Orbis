-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. PUBLIC.STUDENTS (Profile Table)
-- ==========================================
create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  full_name text,
  email text,
  phone text,
  gpa text,         -- Stored as text to handle formats like "3.8" or "90%"
  current_year text,-- e.g., "Undergrad", "Graduate"
  major text,       -- e.g., "Computer Science"
  target_country text,
  career_goal text,
  past_records text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. PUBLIC.CHAT_HISTORY (Chat Persistence)
-- ==========================================
create table if not exists public.chat_history (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references auth.users not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
alter table public.students enable row level security;
alter table public.chat_history enable row level security;

-- STUDENTS Table Policies
-- Drop existing policies if they exist to avoid conflict on re-run
drop policy if exists "Users can view their own profile" on public.students;
create policy "Users can view their own profile"
  on public.students for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can update their own profile" on public.students;
create policy "Users can update their own profile"
  on public.students for update
  using ( auth.uid() = user_id );

drop policy if exists "Service role can manage all students" on public.students;
create policy "Service role can manage all students"
  on public.students
  using ( true )
  with check ( true );

-- CHAT_HISTORY Table Policies
drop policy if exists "Users can view their own chat history" on public.chat_history;
create policy "Users can view their own chat history"
  on public.chat_history for select
  using ( auth.uid() = student_id );

drop policy if exists "Users can insert their own chat history" on public.chat_history;
create policy "Users can insert their own chat history"
  on public.chat_history for insert
  with check ( auth.uid() = student_id );

-- ==========================================
-- 4. AUTOMATIC USER CREATION TRIGGER
-- ==========================================

-- Drop trigger if exists to avoid duplication errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

-- Create Function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.students (
    user_id, 
    email, 
    full_name, 
    phone, 
    gpa, 
    current_year, 
    major, 
    target_country, 
    career_goal, 
    past_records
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'gpa',
    new.raw_user_meta_data->>'current_year',
    new.raw_user_meta_data->>'major',
    new.raw_user_meta_data->>'target_country',
    new.raw_user_meta_data->>'career_goal' || '', -- Fallback to empty string if null
    new.raw_user_meta_data->>'past_records'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- END OF SCRIPT
-- ==========================================
