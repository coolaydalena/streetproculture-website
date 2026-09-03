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
- `src/lib/site.ts` — nav, contact, currency, `CHECKOUT_ENABLED` flag
- `src/lib/products.ts` — mock catalog (4 ported products + brand/merch placeholders)
- `src/lib/brands.ts` — brand lineup
- `src/lib/cart-context.tsx` — cart state (React context + localStorage)
- `src/lib/checkout-flow.tsx` — cart/checkout/confirmation overlay stage machine
- `public/images/{home,products,logos}` — imagery (prototype media + resources/)

## Deferred

- **Payments**: Paymongo. `CHECKOUT_ENABLED = false` in `src/lib/site.ts` keeps the
  checkout form's submit disabled. Flip to `true` once the API route + keys exist.
- Real store address / hours / map, real product catalog & PHP pricing, real brand logos.
