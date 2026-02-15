-- Create the active_roadmaps table
create table active_roadmaps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  career_path text not null,
  roadmap_type text not null check (roadmap_type in ('fast_track', 'growth', 'mastery')),
  milestones jsonb not null,
  current_day int default 1,
  total_xp int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table active_roadmaps enable row level security;

-- Policy: Allow users to insert their own roadmaps
create policy "Enable insert for authenticated users only"
on active_roadmaps for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Allow users to view their own roadmaps
create policy "Enable select for users based on user_id"
on active_roadmaps for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Allow users to update their own roadmaps
create policy "Enable update for users based on user_id"
on active_roadmaps for update
to authenticated
using (auth.uid() = user_id);
