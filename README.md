# Rajras — Ghar Jaisa. Roz Ka.

A premium home-style tiffin ordering website. React + Vite + Tailwind CSS,
zero backend — orders are sent straight to WhatsApp.

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

The production build lands in `dist/` and can be deployed to Netlify,
Vercel, GitHub Pages, or any static host.

## Everything you'll want to edit lives in one file

`src/config/rajrasConfig.js`

- `whatsappNumber` — **set this before launch.** Digits only, with country
  code, e.g. `919876543210`. This is where every order gets sent.
- `phoneNumber`, `deliveryArea`, `deliveryTimings`
- `price`, `deliveryCharge`
- `todaysMenu` — the daily tiffin items
- `mealComponents`, `whyRajras`, `howItWorks`, `testimonials`, `faqs`

Nothing else in the codebase needs to change for day-to-day updates.

## Structure

```
src/
  components/     one file per section (Hero, Menu, FAQ, OrderModal, ...)
  config/         rajrasConfig.js — all editable business content
  hooks/          useReveal.js — scroll-in animation
  utils/          whatsapp.js — builds the WhatsApp order message + link
```

## Notes for the next pass

- The hero and menu artwork (`src/components/TiffinArt.jsx`) is an
  illustrated SVG placeholder, not a photograph — swap in real food
  photography when available (the file has a comment showing exactly
  where).
- Testimonials in the config file are placeholders — replace with real
  reviews once you have them.
- The map in the delivery-area section is a placeholder block — drop in
  an embedded map when ready.
