-- ============================================================
-- Vietnam Explorer — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROVINCES
-- ============================================================
create table if not exists public.provinces (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  region      text not null check (region in ('Miền Bắc', 'Miền Trung', 'Miền Nam')),
  description text,
  image       text,
  visits_count integer default 0,
  map_x       float default 50,  -- x position on map (0-100)
  map_y       float default 50,  -- y position on map (0-100)
  highlight_color text default '#22c55e',
  created_at  timestamptz default now()
);

-- ============================================================
-- 2. FOODS
-- ============================================================
create table if not exists public.foods (
  id          uuid primary key default uuid_generate_v4(),
  province_id uuid references public.provinces(id) on delete cascade,
  name        text not null,
  description text,
  image       text,
  location    text,
  created_at  timestamptz default now()
);

-- ============================================================
-- 3. ATTRACTIONS (tourism + entertainment)
-- ============================================================
create table if not exists public.attractions (
  id          uuid primary key default uuid_generate_v4(),
  province_id uuid references public.provinces(id) on delete cascade,
  name        text not null,
  description text,
  image       text,
  location    text,
  type        text not null check (type in ('tourism', 'entertainment')),
  created_at  timestamptz default now()
);

-- ============================================================
-- 4. COMMENTS
-- ============================================================
create table if not exists public.comments (
  id          uuid primary key default uuid_generate_v4(),
  province_id uuid references public.provinces(id) on delete cascade,
  username    text not null,
  content     text not null,
  created_at  timestamptz default now()
);

-- ============================================================
-- 5. REACTIONS
-- ============================================================
create table if not exists public.reactions (
  id          uuid primary key default uuid_generate_v4(),
  province_id uuid references public.provinces(id) on delete cascade,
  emoji       text not null,
  count       integer default 1,
  updated_at  timestamptz default now(),
  unique(province_id, emoji)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_foods_province on public.foods(province_id);
create index if not exists idx_attractions_province on public.attractions(province_id);
create index if not exists idx_attractions_type on public.attractions(type);
create index if not exists idx_comments_province on public.comments(province_id);
create index if not exists idx_reactions_province on public.reactions(province_id);
create index if not exists idx_provinces_region on public.provinces(region);
create index if not exists idx_provinces_slug on public.provinces(slug);

-- ============================================================
-- RPC: increment visit count
-- ============================================================
create or replace function increment_province_visits(province_id uuid)
returns void as $$
  update public.provinces
  set visits_count = visits_count + 1
  where id = province_id;
$$ language sql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.provinces enable row level security;
alter table public.foods enable row level security;
alter table public.attractions enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;

-- Public read access
create policy "Public read provinces" on public.provinces for select using (true);
create policy "Public read foods" on public.foods for select using (true);
create policy "Public read attractions" on public.attractions for select using (true);
create policy "Public read comments" on public.comments for select using (true);
create policy "Public read reactions" on public.reactions for select using (true);

-- Public write for comments and reactions (no auth needed)
create policy "Anyone can comment" on public.comments for insert with check (true);
create policy "Anyone can react" on public.reactions for insert with check (true);
create policy "Anyone can update reactions" on public.reactions for update using (true);

-- Admin write for provinces, foods, attractions
-- (In production, restrict this to authenticated admin users)
create policy "Authenticated can write provinces" on public.provinces
  for all using (auth.role() = 'authenticated');
create policy "Authenticated can write foods" on public.foods
  for all using (auth.role() = 'authenticated');
create policy "Authenticated can write attractions" on public.attractions
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — 10 provinces
-- ============================================================
insert into public.provinces (slug, name, region, description, image, visits_count, map_x, map_y, highlight_color) values
('ha-noi', 'Hà Nội', 'Miền Bắc', 'Thủ đô ngàn năm văn hiến, trung tâm chính trị, văn hóa và kinh tế của Việt Nam. Hà Nội mang trong mình vẻ đẹp cổ kính của 36 phố phường, hồ Hoàn Kiếm thơ mộng và kiến trúc Pháp độc đáo.', 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80', 1250, 48, 18, '#22c55e'),
('ho-chi-minh', 'TP. Hồ Chí Minh', 'Miền Nam', 'Thành phố năng động nhất Việt Nam, trung tâm kinh tế lớn nhất cả nước với lịch sử phong phú và văn hóa đa dạng. Sài Gòn - tên gọi thân thương của người dân miền Nam.', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80', 2100, 45, 82, '#f59e0b'),
('da-nang', 'Đà Nẵng', 'Miền Trung', 'Thành phố đáng sống nhất Việt Nam với bãi biển Mỹ Khê tuyệt đẹp, Cầu Rồng nổi tiếng và Bà Nà Hills huyền ảo.', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80', 980, 50, 52, '#3b82f6'),
('hoi-an', 'Hội An', 'Miền Trung', 'Phố cổ Hội An - Di sản Văn hóa Thế giới UNESCO với những ngôi nhà cổ rêu phong và đèn lồng lung linh.', 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80', 856, 52, 55, '#f59e0b'),
('ha-long', 'Hạ Long', 'Miền Bắc', 'Vịnh Hạ Long - Kỳ quan Thiên nhiên Thế giới với hơn 1600 hòn đảo đá vôi sừng sững giữa mặt biển xanh biếc.', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80', 1450, 55, 16, '#06b6d4'),
('hue', 'Huế', 'Miền Trung', 'Cố đô Huế - thành phố của những lăng tẩm, chùa chiền và cung điện triều Nguyễn.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 720, 50, 48, '#a855f7'),
('sapa', 'Sa Pa', 'Miền Bắc', 'Thị trấn trong sương mù với những ruộng bậc thang tuyệt đẹp và đỉnh Fansipan hùng vĩ.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 634, 38, 12, '#10b981'),
('phu-quoc', 'Phú Quốc', 'Miền Nam', 'Đảo Ngọc Phú Quốc - hòn đảo lớn nhất Việt Nam với bãi biển cát trắng mịn và nước biển trong xanh.', 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80', 1120, 28, 88, '#06b6d4'),
('nha-trang', 'Nha Trang', 'Miền Trung', 'Thành phố biển Nha Trang với bờ biển đẹp bậc nhất Việt Nam và Tháp Bà Ponagar huyền bí.', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80', 890, 55, 67, '#3b82f6'),
('can-tho', 'Cần Thơ', 'Miền Nam', 'Thành phố miền Tây sông nước với chợ nổi Cái Răng nổi tiếng và nét văn hóa sông nước đặc trưng.', 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&q=80', 456, 40, 90, '#f59e0b')
on conflict (slug) do nothing;
