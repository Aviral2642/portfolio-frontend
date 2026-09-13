# Aviral Srivastava — designer portfolio

Local preview: **http://127.0.0.1:4174/**

The homepage is the new graphic-led designer portfolio. The observatory, city and
floating-sculpture experiences have been removed and recoverably archived.

## Run locally

```sh
npm run build
npm run preview:local
```

Requires Node 22.13+ or Node 24+. Run `npm ci` in a fresh checkout, then the commands
above. If port 4174 is already serving this project, rebuilding is enough; refresh
the browser. For live development use `npm start` (port 3000). These commands do
not deploy. Do not run deploy/predeploy before approval.

The release toolchain is Vite 8, Vitest 5 and ESLint 10. CRA and libraries used
only by the retired world/GraphQL frontend were removed. The React 18 page and
native-scrolling motion system remain intact. `npm test` runs the full suite;
`CI=true npm run build` includes lint. Keep the lockfile with the release.

## Implementation

Review candidate: [Under the microscope](http://127.0.0.1:4174/preview/microscope)
is a separate lazy route, not linked from the homepage and excluded from production
builds. Use `npm run build:review` before `npm run preview:local` to try it, or
visit `/preview/microscope` on the development server. It uses an original benign
specimen for a movable byte lens, exploded sections, extracted strings and an
annotated instruction view. No uploads, binary execution, or backend requests.
See [MICROSCOPE.md](MICROSCOPE.md) for scope, sources and verification.

- `src/designer/VideoOpening.js`: replacement cyberpunk-city video controlled by
  native scrolling, followed by the eye-to-name reveal in `IdentityHero.js`.
  `useIntroPlayback.js` owns progression and serialized frame-accurate seeking;
  `introTiming.js` exposes timing. Reduced motion/media errors show the identity
  immediately. Media details and test conditions: [INTRO.md](INTRO.md).
- `src/designer/DesignerPortfolio.js`: complete page, semantic content, native
  chapter links and scoped GSAP choreography. No navigable 3D world.
- `src/designer/designer.css`: Anton/Manrope type system, purple editorial
  spreads, responsive layouts, focus states and reduced-motion treatment.
- `src/designer/FluidInk.js`: optional bounded WebGL2 pointer ink throughout the
  page; native cursor, no mobile/reduced-motion simulation, idle/visibility pause.
- `src/designer/DepthSections.js` and `depth.css`: CVE rail, career/education
  parallax, speaking previews, HTB ranking snapshot and Medium/HackerNoon spreads.
- `src/designer/GoldType.js`: progressively loaded, beveled Three.js award type;
  accessible HTML and static dimensional lettering remain without WebGL.
- Existing `src/data` collections and `src/experience/content.js` remain the
  content sources. The `/exploits` presentation is redesigned; its existing research
  data and technical source assets are preserved.

## Contact

Contact is LinkedIn-only at the owner's request. The oversized closing action and
“Connect with me on LinkedIn” link open the existing profile in a new tab.
GitHub and resume access remain. No contact form, email address, mailto link,
contact API request, or frontend API environment configuration is required.
The no-JavaScript fallback also provides LinkedIn and resume links.
The separate backend and its pending local improvements are unchanged; this
portfolio contact flow no longer depends on Render or MongoDB delivery.

## Review and recovery

See [TESTING.md](TESTING.md) for measured checks and limitations,
[CONTENT_COVERAGE.md](CONTENT_COVERAGE.md) for retained content,
[MOTION.md](MOTION.md) for animation ownership, and [RECOVERY.md](RECOVERY.md)
for the verified recovery archive. Asset/font/technique credits ship at
`/editorial/credits.txt`.

The personal portrait and AS mark were removed at the owner's request. Supplied
Amazon, Penn State and Amity photographs anchor career/education. The Amazon
image retains its stock watermark; the owner requested keeping it and removing
the preview caption. This does not independently establish asset licensing.
Speaking uses original editorial covers, not invented event photos.
HTB #34 globally / #10 USA is explicitly a dated owner-reported snapshot.

Review artifacts are local-only under `output/playwright/` and excluded from Git.

## Release behavior

`npm run deploy` is approval-only. Its predeploy runs tests and builds, never
research synchronization. `npm run sync-exploits` is a separate intentional data
import and is not part of release verification. Static archive metadata and a
legacy `/research` redirect are produced by `scripts/finalize-build.mjs`.
