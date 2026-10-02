# Babiko storefront

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Upload the contents of `dist/` to the Hostinger domain's web root.

## Replace launch content

Edit `src/data.ts` to add real product names, prices, images, materials, developmental benefits, Amazon URLs, and the Babiko WhatsApp Business number. The current catalogue and images are launch placeholders.

The brand mark and all visual components are custom CSS in `src/styles.css`; no Tailwind or component library is used.

## Sanity (products data)

This project includes a lightweight Sanity client at `src/sanity/client.ts` and a helper `loadProducts()` in `src/data.ts`.

Setup steps:
- Install the Sanity client: `npm install @sanity/client`
- Add environment variables (Vite):
	- `VITE_SANITY_PROJECT_ID` — your Sanity project id
	- `VITE_SANITY_DATASET` — dataset name (default `production`)
	- `VITE_SANITY_TOKEN` — optional write token when needed
- Create a `product` schema in your Sanity studio that maps the fields consumed by the app (name, price, image, gallery, benefits, includes, etc.).

Usage:
- In code, call `await loadProducts()` from `src/data.ts` to attempt a Sanity fetch with the local static `products` array as a fallback.

