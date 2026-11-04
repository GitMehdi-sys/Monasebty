# The working design brief

Build EazyWed as a polished, frontend-only wedding directory beta for Laayoune.
Retain the React/Vite stack and EazyWed name. Design for couples and families
who need to find local businesses, understand what is known, save a shortlist,
and enquire directly.

Create a botanical editorial identity with forest green, soft white, restrained
gold, Cormorant Garamond display typography and readable Manrope controls.
Use real Moroccan wedding reference photography with visible attribution.
Never present reference images as photos of the businesses.

Add rotating hero service banners with arrows, dots, play/pause, keyboard access
and reduced-motion support. Feature real, source-backed Laayoune businesses.
Until a vendor publishes an actual promotion, show a service highlight and
quote request rather than inventing a discount, price or availability.

Keep real directory data in eazywed/src/data/laayoune.js. Record source URLs
and the checked date. Do not invent ratings, reviews, photos or missing details.
Do not write to Atlas, run a database seed, send messages or create accounts.
Run the frontend alone. Save shortlists in the browser. Preserve the original
backend for future work without using it in this beta.

Implement coherent desktop/mobile search, catalog, source-backed details,
shortlist, useful empty/error states, contact preview and gated account tools.
Verify the build, changed-code lint, local data logic and browser interactions.
