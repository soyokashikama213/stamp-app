-- ============================================
-- スタンプ帳アプリ Supabase スキーマ
-- Supabase の SQL Editor に貼り付けて実行してください
-- ============================================

-- 習慣テーブル
create table if not exists habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  emoji      text not null default '🏃',
  color      text not null default '#FFB3C6',
  "order"    int  not null default 0,
  created_at timestamptz not null default now()
);

-- スタンプテーブル
create table if not exists stamps (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  habit_id   uuid not null references habits(id) on delete cascade,
  date       date not null,
  created_at timestamptz not null default now(),
  unique(habit_id, date)   -- 同じ日・同じ習慣に2重スタンプ不可
);

-- インデックス（高速化）
create index if not exists habits_user_id_idx on habits(user_id);
create index if not exists stamps_user_id_idx on stamps(user_id);
create index if not exists stamps_date_idx     on stamps(date);

-- ============================================
-- Row Level Security（自分のデータしか見えない）
-- ============================================
alter table habits enable row level security;
alter table stamps enable row level security;

-- habitsのRLSポリシー
create policy "habits: 自分のみ参照"  on habits for select using (auth.uid() = user_id);
create policy "habits: 自分のみ追加"  on habits for insert with check (auth.uid() = user_id);
create policy "habits: 自分のみ更新"  on habits for update using (auth.uid() = user_id);
create policy "habits: 自分のみ削除"  on habits for delete using (auth.uid() = user_id);

-- stampsのRLSポリシー
create policy "stamps: 自分のみ参照"  on stamps for select using (auth.uid() = user_id);
create policy "stamps: 自分のみ追加"  on stamps for insert with check (auth.uid() = user_id);
create policy "stamps: 自分のみ削除"  on stamps for delete using (auth.uid() = user_id);
