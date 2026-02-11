-- Profiles (auto-created on signup)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  stripe_customer_id text,
  links_today integer default 0,
  links_today_reset date default current_date,
  created_at timestamptz default now()
);

-- Links
create table links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  short_code text unique not null,
  original_url text not null,
  title text,
  password_hash text,
  expires_at timestamptz,
  is_active boolean default true,
  clicks integer default 0,
  created_at timestamptz default now()
);

-- Click analytics
create table clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references links(id) on delete cascade not null,
  clicked_at timestamptz default now(),
  ip_address text,
  country text,
  city text,
  device text,
  browser text,
  os text,
  referrer text
);

-- Indexes
create index idx_links_short_code on links(short_code);
create index idx_links_user_id on links(user_id);
create index idx_clicks_link_id on clicks(link_id);
create index idx_clicks_clicked_at on clicks(clicked_at);

-- RLS
alter table profiles enable row level security;
alter table links enable row level security;
alter table clicks enable row level security;

create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Insert own profile" on profiles for insert with check (true);

create policy "Users read own links" on links for select using (auth.uid() = user_id);
create policy "Users create links" on links for insert with check (auth.uid() = user_id);
create policy "Users update own links" on links for update using (auth.uid() = user_id);
create policy "Users delete own links" on links for delete using (auth.uid() = user_id);
-- Public read for redirect
create policy "Public read active links" on links for select using (is_active = true);

create policy "Users read own clicks" on clicks for select using (
  link_id in (select id from links where user_id = auth.uid())
);
create policy "Public insert clicks" on clicks for insert with check (true);

-- Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment clicks atomically
create or replace function increment_clicks(link_short_code text)
returns uuid
language plpgsql
security definer
as $$
declare
  link_uuid uuid;
begin
  update links set clicks = clicks + 1
  where short_code = link_short_code and is_active = true
  returning id into link_uuid;
  return link_uuid;
end;
$$;
