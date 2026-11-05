# EazyWed · Laayoune frontend beta

Open MILEDEV.code-workspace (or the Edit MILEDEV Desktop shortcut).
Double-click START PROJECT.cmd, then visit http://localhost:5173.

This beta runs only the React/Vite frontend. It does not start Express,
connect to MongoDB Atlas, seed data, send OTPs, create bookings, or send messages.
Shortlists use this browser's localStorage and do not require an account.

## Files to edit

- eazywed/src/data/laayoune.js — real public business listings and their sources.
- eazywed/src/pages/common/HeroOffers.jsx — hero banners, links and rotation.
- eazywed/src/pages/common/HeroOffers.css — banner appearance.
- eazywed/src/pages/Home.jsx and Home.css — homepage content and layout.
- eazywed/src/styles/experience.css — shared design tokens.

## Data rules

Laayoune only. All six entries have public-source links and a checked date.
The listings are not confirmed EazyWed partners. Confirm contacts and wedding
services directly. Prices, discounts, availability, reviews and business photos
have not been verified and are not fabricated.
The banners highlight services and quote enquiries, not confirmed promotions.
Decorative wedding photos are credited and identified as inspiration.

## Commands

npm run dev # Frontend only
npm run build # Production frontend build
node --test eazywed/tests/beta-directory.test.js

The original backend is kept for future development and is unused by the beta.
Do not connect it or import these frontend entries into Atlas without a separate decision.
