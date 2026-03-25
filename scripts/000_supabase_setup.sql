create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  price numeric(10, 2) not null default 0,
  stock integer not null default 0,
  stock_quantity integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  cover_image text,
  cover_image_url text,
  isbn text,
  discount_percentage integer not null default 0,
  publication_year integer,
  is_featured boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) generated always as (total) stored,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  quantity integer not null default 1,
  price numeric(10, 2) not null,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.books enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists categories_select_all on public.categories;
drop policy if exists categories_insert_admin on public.categories;
drop policy if exists categories_update_admin on public.categories;
drop policy if exists categories_delete_admin on public.categories;

create policy categories_select_all on public.categories
for select
using (true);

create policy categories_insert_admin on public.categories
for insert
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy categories_update_admin on public.categories
for update
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy categories_delete_admin on public.categories
for delete
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists books_select_all on public.books;
drop policy if exists books_insert_admin on public.books;
drop policy if exists books_update_admin on public.books;
drop policy if exists books_delete_admin on public.books;

create policy books_select_all on public.books
for select
using (true);

create policy books_insert_admin on public.books
for insert
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy books_update_admin on public.books
for update
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy books_delete_admin on public.books
for delete
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_select_admin on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_update_admin on public.profiles;

create policy profiles_select_own on public.profiles
for select
using (auth.uid() = id);

create policy profiles_select_admin on public.profiles
for select
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy profiles_insert_own on public.profiles
for insert
with check (auth.uid() = id);

create policy profiles_update_own on public.profiles
for update
using (auth.uid() = id);

create policy profiles_update_admin on public.profiles
for update
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_select_admin on public.orders;
drop policy if exists orders_insert_own on public.orders;
drop policy if exists orders_update_admin on public.orders;

create policy orders_select_own on public.orders
for select
using (user_id = auth.uid());

create policy orders_select_admin on public.orders
for select
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy orders_insert_own on public.orders
for insert
with check (user_id = auth.uid());

create policy orders_update_admin on public.orders
for update
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists order_items_select_own on public.order_items;
drop policy if exists order_items_select_admin on public.order_items;
drop policy if exists order_items_insert_own on public.order_items;

create policy order_items_select_own on public.order_items
for select
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
  )
);

create policy order_items_select_admin on public.order_items
for select
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy order_items_insert_own on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders
    where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'user')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_books_category on public.books(category_id);
create index if not exists idx_books_title on public.books(title);
create index if not exists idx_books_author on public.books(author);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_book on public.order_items(book_id);

insert into public.categories (id, name, slug, description) values
  ('11111111-1111-1111-1111-111111111111', 'Fiction', 'fiction', null),
  ('22222222-2222-2222-2222-222222222222', 'Non-Fiction', 'non-fiction', null),
  ('33333333-3333-3333-3333-333333333333', 'Science Fiction', 'science-fiction', null),
  ('44444444-4444-4444-4444-444444444444', 'Mystery', 'mystery', null),
  ('55555555-5555-5555-5555-555555555555', 'Biography', 'biography', null),
  ('66666666-6666-6666-6666-666666666666', 'Self-Help', 'self-help', null)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description;

insert into public.books (
  id,
  title,
  author,
  price,
  stock,
  stock_quantity,
  category_id,
  description,
  cover_image,
  cover_image_url,
  is_featured
) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'The Great Gatsby', 'F. Scott Fitzgerald', 14.99, 50, 50, '11111111-1111-1111-1111-111111111111',
   'A story of decadence and excess, exploring themes of idealism and the American Dream in the Jazz Age.',
   'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '1984', 'George Orwell', 12.99, 75, 75, '33333333-3333-3333-3333-333333333333',
   'A dystopian social science fiction novel that explores themes of totalitarianism and surveillance.',
   'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'To Kill a Mockingbird', 'Harper Lee', 15.99, 40, 40, '11111111-1111-1111-1111-111111111111',
   'A classic of modern American literature about racial injustice and moral growth in the Deep South.',
   'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Sapiens', 'Yuval Noah Harari', 18.99, 60, 60, '22222222-2222-2222-2222-222222222222',
   'A brief history of humankind, exploring how Homo sapiens came to dominate the world.',
   'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'The Sherlock Holmes Collection', 'Arthur Conan Doyle', 24.99, 30, 30, '44444444-4444-4444-4444-444444444444',
   'The complete adventures of the world''s most famous detective, Sherlock Holmes.',
   'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Steve Jobs', 'Walter Isaacson', 19.99, 45, 45, '55555555-5555-5555-5555-555555555555',
   'The exclusive biography of Steve Jobs, based on more than forty interviews with him.',
   'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Atomic Habits', 'James Clear', 16.99, 100, 100, '66666666-6666-6666-6666-666666666666',
   'An easy and proven way to build good habits and break bad ones.',
   'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'Dune', 'Frank Herbert', 17.99, 55, 55, '33333333-3333-3333-3333-333333333333',
   'Set in the distant future, Dune is a science fiction epic about politics, religion, and ecology.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'The Psychology of Money', 'Morgan Housel', 15.99, 80, 80, '66666666-6666-6666-6666-666666666666',
   'Timeless lessons on wealth, greed, and happiness from one of the most influential finance writers.',
   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', 'Gone Girl', 'Gillian Flynn', 13.99, 35, 35, '44444444-4444-4444-4444-444444444444',
   'A thriller about a marriage gone terribly wrong, full of twists and dark secrets.',
   'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', 'Educated', 'Tara Westover', 17.99, 42, 42, '55555555-5555-5555-5555-555555555555',
   'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.',
   'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
   false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', 'The Midnight Library', 'Matt Haig', 14.99, 65, 65, '11111111-1111-1111-1111-111111111111',
   'Between life and death there is a library, and within that library, the shelves go on forever.',
   'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
   'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
   false)
on conflict (id) do update
set
  title = excluded.title,
  author = excluded.author,
  price = excluded.price,
  stock = excluded.stock,
  stock_quantity = excluded.stock_quantity,
  category_id = excluded.category_id,
  description = excluded.description,
  cover_image = excluded.cover_image,
  cover_image_url = excluded.cover_image_url,
  is_featured = excluded.is_featured;
