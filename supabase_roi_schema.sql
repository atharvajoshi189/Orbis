-- Create the roi_simulations table
create table roi_simulations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  target_country text not null,
  budget numeric not null,
  analysis_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table roi_simulations enable row level security;

-- Policy: Allow users to insert their own simulations (or anyone if anon is allowed)
create policy "Enable insert for authenticated users only"
on roi_simulations for insert
to authenticated
with check (true);

-- Policy: Allow users to view their own simulations
create policy "Enable select for users based on user_id"
on roi_simulations for select
to authenticated
using (auth.uid() = user_id);
