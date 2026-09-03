-- Street Pro Culture — products table.

create table public.streetproculture_products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique
                    constraint streetproculture_products_slug_format
                    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category        text not null
                    constraint streetproculture_products_category_check
                    check (category in ('caps', 'helmets', 'cases', 'merch')),
  tag             text not null default '',
  name            text not null,
  -- Whole-peso amount (no centavos). Paymongo (Phase 2) converts to centavos.
  price           integer not null check (price >= 0),
  blurb           text not null default '',
  brand           text,
  -- array of { "label": string, "value": string }
  specs           jsonb not null default '[]'::jsonb
                    check (jsonb_typeof(specs) = 'array'),
  -- false => infinite stock. true => stock_quantity is authoritative.
  track_inventory boolean not null default true,
  stock_quantity  integer check (stock_quantity is null or stock_quantity >= 0),
  -- shown in the home-page "The Shop" section
  is_highlighted  boolean not null default false,
  -- public visibility gate
  is_published    boolean not null default false,
  -- renders the "Preview listing" note (placeholder art / pricing)
  is_mock         boolean not null default false,
  created_by      uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index streetproculture_products_published_idx
  on public.streetproculture_products (is_published);
create index streetproculture_products_category_published_idx
  on public.streetproculture_products (category)
  where is_published;
create index streetproculture_products_highlighted_idx
  on public.streetproculture_products (is_highlighted)
  where is_published and is_highlighted;

create trigger streetproculture_products_set_updated_at
  before update on public.streetproculture_products
  for each row execute function public.streetproculture_set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.streetproculture_products enable row level security;

-- anyone can read published products
create policy streetproculture_products_public_read
  on public.streetproculture_products
  for select
  to anon, authenticated
  using (is_published);

-- superadmins can read everything, including drafts
create policy streetproculture_products_admin_read
  on public.streetproculture_products
  for select
  to authenticated
  using (public.is_superadmin());

create policy streetproculture_products_admin_insert
  on public.streetproculture_products
  for insert
  to authenticated
  with check (public.is_superadmin());

create policy streetproculture_products_admin_update
  on public.streetproculture_products
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

create policy streetproculture_products_admin_delete
  on public.streetproculture_products
  for delete
  to authenticated
  using (public.is_superadmin());
