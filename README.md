# BlockBuy — Curated Marketplace Redesign

A responsive, static HTML/CSS/JavaScript redesign for the BlockBuy GitHub Pages website.

## Files
- `index.html` — semantic page structure and all sections/dialogs
- `styles.css` — responsive design system, visual styling, light/dark themes
- `app.js` — search, category/edition filters, sorting, saved shortlist, listing details, local listing drafts and local preferences

## Features
- Premium charcoal + lime identity with a block-inspired hero illustration
- Dedicated quick-link destinations for Marketplace, Categories, Creators and Sell
- Search listings by title, category, creator or description
- Filter by category and Java/Bedrock compatibility
- Sort by featured, price or name
- Save/unsave listings to a browser-local shortlist
- Listing detail dialogs
- Creator listing draft form; drafts are saved in this browser's `localStorage`
- Mobile navigation, theme toggle, keyboard `/` shortcut to focus search
- Responsive layout and reduced-motion support

## Important current limitations
This is a front-end marketplace foundation. Sample listings and creator names are illustrative and are not verified live inventory. There is no authentication, database, real seller verification, checkout, payment processing, or in-game delivery. Listing drafts and saved items stay only in the current browser. Do not advertise real products or accept payments until a backend and safe, authorized fulfillment flow are implemented.

## Publish to GitHub Pages
1. Download and extract the ZIP.
2. Open your existing BlockBuy repository on GitHub.
3. Upload/replace `index.html`, `styles.css`, `app.js`, and `README.md` in the repository's published root (usually the root folder, unless Pages is configured to use `/docs`).
4. Commit the changes to the branch configured for GitHub Pages.
5. Open `https://blockbuy.github.io/` and hard-refresh if the old version is cached.

Keep a local copy of the current files before replacing them. If the repository's published root is configured as `/docs`, upload the files there instead.

## No build step
This uses plain HTML, CSS and JavaScript. No npm install, framework, or paid service is required for the front end.

## Brand note
BlockBuy is an independent fan concept and is not affiliated with or endorsed by Mojang or Microsoft. Minecraft is a trademark of its respective owner.
