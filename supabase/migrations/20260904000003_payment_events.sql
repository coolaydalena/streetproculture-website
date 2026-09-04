-- Street Pro Culture — Phase 2 PayMongo webhook event log.
--
-- Gives the webhook handler idempotency (unique paymongo_event_id) plus an
-- audit trail. Written only by the service-role client.

create table public.streetproculture_payment_events (
  id                 uuid primary key default gen_random_uuid(),
  -- The `data.id` of the PayMongo event envelope. Unique → a replayed event
  -- is a no-op.
  paymongo_event_id  text not null unique,
  event_type         text not null,
  order_id           uuid references public.streetproculture_orders (id) on delete set null,
  signature_verified boolean not null default false,
  payload            jsonb not null,
  processing_error   text,
  processed_at       timestamptz,
  created_at         timestamptz not null default now()
);

create index streetproculture_payment_events_order_idx
  on public.streetproculture_payment_events (order_id);

alter table public.streetproculture_payment_events enable row level security;

create policy streetproculture_payment_events_select_admin
  on public.streetproculture_payment_events
  for select
  to authenticated
  using (public.is_superadmin());
-- No write policy: service-role only.
