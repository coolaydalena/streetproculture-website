# Street Pro Culture — Website & Shop

Next.js (App Router, TS, Tailwind v4) rebuild of the base44 prototype at
`street-pro-gear.base44.app`, extended with Services (PMS), Cafe (Upshift),
Brands and Visit pages.

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (Turbopack, fully static)
npm run lint
```

## Structure

- `src/app/*` — routes: `/`, `/shop`, `/services`, `/cafe`, `/brands`, `/visit`
- `src/components/{layout,home,shop,ui}` — components
- `src/lib/site.ts` — nav, contact, currency helpers
- `src/lib/products.ts` — product domain types + helpers
- `src/lib/brands.ts` — brand lineup
- `src/lib/store/cart-store.ts` — cart state (zustand + localStorage `persist`)
- `src/lib/store/cart-ui-store.ts` — cart slide-over open/close
- `src/lib/{money,paymongo,orders,settings,payments}.ts` — checkout + orders domain
- `public/images/{home,products,logos,payment-methods}` — imagery

## Checkout (Phase 2)

- `/checkout` (dedicated page) → PayMongo hosted checkout → `/checkout/success`
  → `/orders/<token>` (public tracking) / `/account/orders` (signed-in history).
- The customer picks the payment method on our side so the exact processing fee
  is known; the PayMongo Checkout Session is locked to that one method.
  Pickup orders may also "pay at the shop" (no PayMongo transaction).
- Superadmin: `/admin/settings` (fees + methods, `checkout_enabled` toggle),
  `/admin/orders` (pending / past, status updates).
- DB: `supabase/migrations/20260904*` — `streetproculture_{settings,payment_methods,
  orders,order_items,payment_events}`. Money stored in integer centavos.
- Webhook: `src/app/api/paymongo/webhook/route.ts` (raw-body HMAC verify,
  service-role client, idempotent). Register it per environment in the PayMongo
  dashboard and set `PAYMONGO_WEBHOOK_SECRET`.
- Env: `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`, `SUPABASE_SECRET_KEY`,
  `CRON_SECRET` — see `.env.example`. Vercel: test keys on Preview (staging),
  live keys on Production (main).

## Deferred

- Transactional email (order confirmation / status updates) — customers rely on
  PayMongo's receipt + the `/orders/<token>` link for now.
- Real store address / hours / map, real product catalog & PHP pricing, real brand logos.
