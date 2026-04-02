-- ResearchHub Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null default '',
  bio text default '',
  avatar_url text default '',
  research_interests text[] default '{}',
  arxiv_author_id text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ============================================
-- BOOKMARKS
-- ============================================
create table if not exists bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  arxiv_id text not null,
  title text not null,
  authors text not null,
  abstract text default '',
  saved_at timestamptz default now(),
  unique(user_id, arxiv_id)
);

alter table bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on bookmarks for delete using (auth.uid() = user_id);

-- ============================================
-- TOPIC SUBSCRIPTIONS
-- ============================================
create table if not exists topic_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null,
  subscribed_at timestamptz default now(),
  unique(user_id, category)
);

alter table topic_subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on topic_subscriptions for select using (auth.uid() = user_id);

create policy "Users can manage own subscriptions"
  on topic_subscriptions for insert with check (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on topic_subscriptions for delete using (auth.uid() = user_id);

-- ============================================
-- GROUPS
-- ============================================
create table if not exists groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text default '',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table groups enable row level security;

create policy "Groups are viewable by everyone"
  on groups for select using (true);

create policy "Authenticated users can create groups"
  on groups for insert with check (auth.uid() = created_by);

create policy "Group creator can update"
  on groups for update using (auth.uid() = created_by);

create policy "Group creator can delete"
  on groups for delete using (auth.uid() = created_by);

-- ============================================
-- GROUP MEMBERS
-- ============================================
create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

alter table group_members enable row level security;

create policy "Group members are viewable by everyone"
  on group_members for select using (true);

create policy "Users can join groups"
  on group_members for insert with check (auth.uid() = user_id);

create policy "Users can leave groups"
  on group_members for delete using (auth.uid() = user_id);

-- ============================================
-- FOLLOWS
-- ============================================
create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table follows enable row level security;

create policy "Follows are viewable by everyone"
  on follows for select using (true);

create policy "Users can follow others"
  on follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on follows for delete using (auth.uid() = follower_id);

-- ============================================
-- SHARED PAPERS (for groups)
-- ============================================
create table if not exists shared_papers (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  shared_by uuid references profiles(id) on delete set null,
  arxiv_id text not null,
  title text not null,
  note text default '',
  shared_at timestamptz default now(),
  unique(group_id, arxiv_id)
);

alter table shared_papers enable row level security;

create policy "Shared papers viewable by everyone"
  on shared_papers for select using (true);

create policy "Group members can share papers"
  on shared_papers for insert with check (auth.uid() = shared_by);

create policy "Sharer can delete"
  on shared_papers for delete using (auth.uid() = shared_by);

-- ============================================
-- FUNCTION: Auto-create profile on signup
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
