# Under the microscope — isolated review candidate

Route: `/preview/microscope`. Deferred by the owner; no homepage link. Available
only in development or `npm run build:review`; excluded from production builds.
The source remains available for a future decision, not part of the live release.

## Direction contract (code-led extension)

THESIS: one real specimen, four representations; interaction reveals meaning.
OWN-WORLD: existing Anton / Manrope / JetBrains Mono, near-black, violet and
selective icy green. The chrome lens is an actual magnifier, not decoration.
STORY: inspect bytes, separate structural regions, extract strings, read the
two-instruction function. Never confuse embedded text with executed behavior.
FIRST VIEWPORT: oversized left-aligned title above a full-width specimen bench;
large lens at left, four view controls and stable explanatory copy at right.
FORM: user-selected microscope interaction; no new identity or concept gate.
FINISH: finish review and as-built notes are recorded here for this isolated
prototype. Global DESIGN.md and its sidecar remain unchanged; there are no new
raster assets requiring provenance.

## Data and boundaries

Original fixed WebAssembly module in `src/designer/microscope/specimen.js`.
One export, `answer`, with body `i32.const 42; end`. No imports, memory or start
function. Tests validate its encoding without instantiating or executing it.
Bytes, ranges and printable ASCII runs come from the same array; opcode
annotations are checked against that array. Exploded plates show file regions,
not an actual memory layout. Behavior is static annotation, not a runtime trace.

References checked September 12, 2026:
- https://webassembly.github.io/spec/core/binary/modules.html
- https://webassembly.github.io/spec/core/binary/instructions.html

## Interaction ownership

The lens uses event-driven, requestAnimationFrame-coalesced SVG updates. No idle
render loop and no per-frame React state. Native arrow keys/Home and touch move
the lens. View changes use CSS opacity and spatial transforms; reduced motion
and keyboard view changes remove those transitions. Reading copy settles until
the visitor deliberately changes a view or selection. Native document scrolling.

All work happens in the frontend. No new library, service, upload, API, analytics,
storage or execution engine. No backend dependency for this experiment. All art
is editable CSS/SVG derived from the specimen; no new raster assets.

Global DESIGN.md remains the authority; this candidate does not redefine it.

## As-built visual and interaction note

Anton carries the two-line title; Manrope carries the explanation and controls;
JetBrains Mono identifies bytes and addresses. Near-black and violet frame a
metallic SVG magnifier, six tilted section plates, extracted strings, and an
icy-green `42`. These four views share one specimen and one reading panel.
Square controls report the selected view, layer, or instruction; a visible
focus outline supports keyboard navigation. The methodology opens with native
details/summary below the bench.

Desktop places the specimen beside its reading panel. At 700px and below, the
four view controls sit above the specimen and the reading panel follows it.
The mobile layer addresses and sizes are small supporting labels; selecting a
plate repeats its range and byte count in readable text below the specimen.
Lens movement supports pointer, touch, and arrow keys, with Home to reset.
Reduced motion preserves every interaction while removing view transitions.

## Finish review disposition

SHIP — isolated local prototype, September 12, 2026. The supplied final desktop,
mobile, keyboard, emulated-touch, and reduced-motion review found no material
fixes remaining. Small mobile plate metadata is accepted because the reading
panel provides the same information. Verification scope and limitations follow.
This verdict completes the experiment; it does not approve homepage inclusion
or deployment. No homepage link, new backend, or WebAssembly execution was added.

## Verification

- 19 frontend tests pass (four specimen checks and three interaction checks added).
- Production build and lint pass. Candidate lazy chunks total approximately
  8.2 KB gzip (JS + CSS), using existing dependencies and fonts.
- Chrome desktop 1440 × 1050: all four views, layer and instruction selection,
  keyboard lens movement, rapid view switching and readable methodology.
- Chrome responsive 390 and 320 × 844: all four views, no document overflow.
- Live reduced-motion change: visual transition duration becomes 0 seconds.
- A 2.5-second browser rAF timing sample during scripted pointer movement gave
  300 samples, median 8.3 ms, p95 9.9 ms, no intervals over 34 ms. Local headed
  Chrome with no CPU throttling; this is not a GPU trace or a mobile benchmark.
- No page errors in the scripted first pass. First-pass caption crowding and
  mobile lens clipping were corrected together; view controls moved above the
  specimen on mobile. Final captures use the same paths as the first pass.
- Screenshots: `output/playwright/microscope-{desktop,mobile}-{0,1,2,3}.png`.
- Final browser pass confirms all modes, selections, rapid retargeting and reduced
  motion again with no page errors or document overflow. A separate mobile-touch
  emulation confirms tapping moves the lens and selects the Strings view. Both
  browser contexts and the test Chrome process were closed afterward.
- The design detector reported advisory palette/type-ramp differences from the
  global sidecar. These are scoped specimen colours and data-display sizes,
  not a redesign of the homepage. No global token changes were made.

No Safari or physical-device performance verification, no backend dependency,
no deployment. Inclusion in the portfolio remains the owner's decision.
