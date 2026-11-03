# ShahRaj Global — Interactive Agency Website

A complete, responsive, motion-rich front-end concept for ShahRaj Global. Built with standard HTML, CSS, and JavaScript so it can be previewed immediately, moved into a Next.js site later, or deployed as a static site without any build step.

## Quick start

Open `index.html` directly in a web browser, or (recommended) start a local web server from this folder:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

No npm install, build tools, API keys, frameworks, or accounts are needed to see the full interactive front end.

## What is included

- Your original ShahRaj Global SVG logo, plus a matching favicon
- Deep-plum / violet / lavender / warm-off-white color system
- Floating responsive pill navigation and mobile menu
- Animated editorial hero and cursor-responsive 3D orb
- Service marquee, drawn-on-scroll underline and hand-drawn word circle
- Circular perspective-based carousel for seven services, with mouse, touch and keyboard navigation
- Interactive wireframe service globe
- Animated service-scope counters (not made-up client performance numbers)
- Four-step process, illustrative service-concept showcase, and map of South Korea / USA / Pakistan
- Interactive engagement-duration selector and three custom-proposal models (no made-up rates or discount claims)
- Illustrative team-role circles that can be swapped for real photos
- Editorial newsletter section and interactive scribble-circle contact CTA
- Accessible labels, responsive layouts, focus states, and reduced-motion fallbacks

## Important pre-launch tasks

1. **Contact form:** In `script.js`, set `CONFIG.contactEmail` to a *real* inbox. The project form will then prepare a message in the visitor's email app. For direct submissions, integrate your preferred backend or form endpoint.
2. **Newsletter:** In `script.js`, set `CONFIG.newsletterEndpoint` to a working, CORS-enabled JSON signup endpoint. Until then, the form explicitly says it is only a demo and does not collect email addresses.
3. **Real photography:** Replace `assets/podcast-visual-ai.png` with your licensed studio photography. The remaining service SVG illustrations are original, editable visual placeholders; replace them with authentic creative/media as desired.
4. **Team:** Replace the illustrated role-initial circles in `index.html` with real team members and accurate bios once available.
5. **Metrics and case studies:** The displayed numbers are about geographic markets and site service categories, not claims of projects delivered. The project gallery explicitly labels itself **concepts**. Add verified outcomes and actual case studies later.
6. **Prices:** Engagement cards are high-level collaboration frameworks. Add verified rates only after your team decides on packages.
7. **Brand:** Review capitalization, taglines, business claims and exact list of services before launch.
8. **Legal and technical:** Add your privacy policy, consent tools if applicable, real social profiles, analytics, email provider, domain, verification and SEO metadata, optimized imagery and hosting configuration.

## Customization locations

| What to edit | Where |
|---|---|
| Text/copy | `index.html` |
| Colors and spacing | Top of `styles.css` (`:root` variables) |
| Motion speed / 3D carousel | `script.js` (`setService`) and `styles.css` animations |
| Service titles | `index.html` service cards and `script.js` `serviceNames` |
| Images and visual art | `/assets` |
| Map markets / pins | Global section in `index.html` and `.map-pin-*` in `styles.css` |
| Inquiry recipient and newsletter | `script.js` `CONFIG` |

## Hosting

This static front-end can be deployed by uploading its contents to Cloudflare Pages, Netlify, GitHub Pages, Vercel (static), or your own server. Preserve the `assets/` folder beside `index.html`.

**Fonts:** The HTML references Google Fonts (Manrope and DM Sans). It falls back gracefully to Arial when offline. If your deployment needs fully offline font loading, use a licensed self-hosted font implementation.

**World map:** Generated from Natural Earth low-resolution public-domain geographic data; client markets follow the geographic points supplied in the project brief.

**Note:** This is a working front-end concept, not a completed production backend or a live deployed domain. Forms deliberately do not claim to deliver messages until configured.
