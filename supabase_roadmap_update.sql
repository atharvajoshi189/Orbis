-- Create Active Roadmaps Table
create table if not exists public.active_roadmaps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null, -- e.g. "Full Stack Developer"
  type text not null, -- 'Fast-Track', 'Growth', 'Mastery'
  milestones jsonb not null default '[]'::jsonb, -- Array of objects: { day: 1, task: "Learn React", xp: 50, status: "pending" }
  current_step integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.active_roadmaps enable row level security;

-- Policies
create policy "Users can view their own roadmaps"
  on public.active_roadmaps for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own roadmaps"
  on public.active_roadmaps for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own roadmaps"
  on public.active_roadmaps for update
  using ( auth.uid() = user_id );

-- Optional: Index for faster lookups
create index if not exists idx_active_roadmaps_user_id on public.active_roadmaps(user_id);
