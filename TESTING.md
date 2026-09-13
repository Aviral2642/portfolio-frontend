# LinkedIn-only contact and campus image — September 12, 2026

The owner removed the contact form after the release checks below. Contact now
links directly to LinkedIn; the live database-delivery issue no longer affects
this frontend flow. Backend code and deployment are unchanged.

- All 12 current frontend tests pass; production build and lint pass.
- Chrome at 1440, 768, 390 and 320 px: no horizontal overflow, contact fields or
  mailto links. No contact API requests or page errors observed.
- Keyboard focus is visible. Enter opens the existing LinkedIn profile URL in
  a new tab (destination intercepted locally; no LinkedIn account action).
- Contact/back-to-top anchors work, resume returns HTTP 200 application/pdf,
  and reduced-motion contact lettering has no transforms.
- Replaced Penn State imagery with the owner's September 12 PNG, compressed to
  a 482,236-byte WebP at original 1672 × 941 resolution. Original download retained.
- Contact screenshots: output/playwright/linkedin-contact-{1440,390}.jpg.
- Fresh-load image checks at 1440 and 390 px confirmed the new WebP's original
  dimensions, readable captions and no overflow. Screenshots:
  output/playwright/penn-state-{1440,390}.jpg. Test Chrome was closed.

# Earlier release remediation — September 12, 2026

Historical checks below include the now-removed contact form.

- Form configured for https://api.aviralsrivastava.tech, verified healthy for GET
  and contact preflight. One owner-approved live POST returned HTTP 500 after
  10.16 seconds. Live database delivery is unresolved; Render logs are needed.
- Cold-start tolerance: 120-second deadline, slow-service notice, no automatic
  POST retries, same-tick duplicate prevention, readonly pending fields, validated
  save receipt and preserved drafts on failure. No personal-email fallback.
- Backend local patch: MongoDB readiness and bounded connection timeouts, contact
  validation/rate limiting, explicit unavailable-storage response, no JWT fallback,
  Apollo 5 migration and corrected GraphQL mount order. Not yet deployed.
- Fresh npm ci passed in both repositories. 19 frontend and 7 backend tests pass.
  CI-mode build including lint passes; both full npm audits report zero known
  vulnerabilities. Audit results are not a comprehensive application security review.
- CRA replaced with Vite/Vitest; retired runtime dependencies removed. React 18,
  current design and research data/source assets preserved. Deploy preparation
  no longer synchronizes research data. Static/client archive metadata corrected.
- Amazon preview caption removed at owner request; supplied image unchanged.
  Obsolete workflow metadata removed; social image is now the current identity.
- Chrome production checks: desktop 1440 px and 768/390/320 px layouts; all page
  sections, no horizontal overflow or broken homepage anchors/unloaded images;
  video forward/reverse seeks, reduced-motion identity and working resume PDF.
- Mocked browser form: success receipt clears fields; 503 retains the draft and
  explains unavailability. No additional live submissions from browser testing.
- Archive: 14 entries, category filters, keyboard expansion, Back to preview,
  reduced-motion artwork, direct /exploits and legacy /research redirect.
- Native transition: 650 ms animation, ~35 ms snapshot preparation, heading focus
  and state cleanup verified. React Router's scheduling is explicitly disabled
  so the custom snapshot commit has one synchronous owner.
- Vite development page verified. Fixed React 18 fetchpriority casing and explicit
  document positioning for Framer Motion scroll measurements. A mocked HTTP 503
  and an intermediate stale chunk during rebuild produced expected diagnostic
  errors; fresh-load archive checks passed after the correction.
- Replaced Motion 10's initial-only reduced-motion hook with a live external-store
  subscription. Preference changes now update video and archive behavior without
  reloading; tested both directions and listener cleanup.
- Corrected the local archive diagnostic to reload after a hash-only navigation:
  addInitScript installs its timing probe only into a new document. Earlier
  missing-probe timeouts were not evidence of a failed archive page load.
- Screenshots refreshed under ignored output/playwright; no new video cache.
  No push or deployment. Browser sessions closed after tests.

Not verified: live MongoDB save, Safari/Firefox, physical phone GPU performance,
sustained frame-rate benchmark, or every external destination.

## Earlier verification history

# Local verification — workflow opening, September 6, 2026

## Heading reveal / disclosure overlap correction (latest)

User's Safari screenshots exposed a real depth-order defect: workflow nodes at
10px remained above a disclosure cover at 1px. The outgoing interface is now
explicitly faded and hidden before the cover begins its wipe; its own contents
are flattened and isolated. This does not rely on one layer covering another.
The reading-plane entrance is now a 650ms interruptible tween, not opacity mapped
directly to wheel distance. Geometry still follows the native scroll score.

Chrome152 on this Mac: targeted rapid .18→.36 scroll recorded opacity0→1 with
63 intermediate frames over518ms (excluding nearly invisible/fully opaque tails),
maximum sampled increment .0584. Forward/reverse cover checks at .59/.64/.70/
.72/.80/.91 confirm UI opacity0 and visibility:hidden whenever the paper is
partially or fully revealed. Pixel-quantized .70 can actually be .69996; the test
asserts non-overlap against the actual cover state rather than rounded progress.
Investigation reading clearance at1365×768 measured22.4px. Direct disclosure
navigation showed opacity1 after80ms. Script: workflow-handoff-check.js.

Repeated native wheel / video run at1440×1000,DPR1: first60px input responds;
all three acts traversed; reverse returns to act0; chapter buttons select1/2/0;
Research lands95px below top.1,394 rAF samples, median8.3ms, p95 9ms, none above
33.4ms. Scheduling observations only, not a GPU trace or cross-device guarantee.
No console/page errors. This recording precedes only the final DATA-label offset
and disclosure text-gutter adjustment; animation logic and timing are identical.

Desktop1440×1000, laptop1365×768, mobile390×844 and reduced-motion captures
refreshed in the existing gallery. Original Langflow text/four links checked;
resumeHTTP200; no horizontal overflow or duplicate IDs. Seven Jest tests pass.
Optimized build succeeds with two pre-existing lint warnings. No dependencies,
backend changes, pushes or deployments. One build failed with ENOSPC; retry
succeeded after disk availability recovered. No unrelated files were removed.

Safari18.6 driver is present, but session creation is denied while Safari's
Allow remote automation setting is disabled. User was asked to enable it; this
patch is NOT visually verified in Safari. Chrome results must not be presented
as proof of Safari compositing. No physical phone testing.

Design assessment: correct 1→3→2 order, direct realization of the angled workflow,
but investigation remains a simplified layered metaphor. See WORKFLOW.md. The
handoff repair does not establish complete fidelity to every creative promise.

## Full-frame / first-scroll correction (preceding version)

Reproduced the previous failure: the object matrix was identical at0/100/300/650px
scroll; final disclosure width was576px on a1440px viewport. Replaced frozen bands
with continuous-velocity waypoints, viewport framing, uniform scale3d, authored
lateral layer separation and a disclosure wipe. Text holds independently of motion.
Native input drives a single score with a45ms filter and140ms maximum settling tail.
Chapter links, hash navigation and boundary exits bypass filtering.

Actual repeated-wheel test, Chrome152,1440×1000,DPR1, video recording active:
first60px wheel input changed the object and reached progress.019.35 further90px
wheel inputs traversed all three acts.1,454 rAF samples,464 distinct rounded
progress values; maximum interior frame-to-frame progress increment.009.
Median8.3ms / p95 9.3ms / zero intervals above33.4ms. These are browser scheduling
observations, not a GPU-present trace or a guarantee for every device. Reverse
wheel returned to act0; chapter buttons selected1/2/0; Research landed95px below
the top. No console/page errors. Recording: /__workflow/motion.webm.

Desktop1440×1000, laptop1365×768, mobile390×844 and reduced-motion captures taken;
no horizontal overflow or duplicate IDs. All original Langflow evidence text and
four source links retained, resumeHTTP200. Seven Jest tests pass; build passes
with the same two pre-existing warnings. Safari/physical phones not verified.
The last cosmetic adjustment moves the illustrative-model note to the chapter bar
on animated desktop to avoid overlap with the moving toolbar; timing is unchanged.

Earlier entries below describe superseded versions, not the current timing.

## Latest targeted update

Framer Motion / CSS 3D workflow → investigation → Langflow disclosure replaces
the former opening only. Final pacing: 480svh, three stationary reading holds,
two quintic-eased spatial transitions. See WORKFLOW.md for exact intervals.
Original Langflow evidence block and all main JSX from recognition onward were
compared against the recovery archive and are byte-for-byte unchanged.

Optimized build passes: main JS 165.26 kB gzip, CSS 13.5 kB gzip. The same two
pre-existing lint warnings below remain. Seven Jest tests pass: four deterministic
timeline/hold/interpolation tests and three mocked contact tests. No live contact
message sent. No libraries installed, backend changes, push or deployment.

Actual browser checks use headed Chrome 152 on this Mac, DPR1, desktop1440×1000,
laptop1365×768, phone-emulated390×844, and reduced-motion desktop/mobile.
Captured all three acts, intermediate poses, sticky exit and original evidence.
Forward/reverse progression, rapid jumps, chapter buttons, Research anchor,
mobile/desktop resize, local input selection/trace, and WebGL-unavailable plus
reduced-motion fallback were exercised. Resume returned HTTP200; original four
Langflow evidence links remained in the DOM. No horizontal overflow or duplicate
IDs in the tested layouts. Physical phones, Safari and Firefox were not tested.

Review: http://127.0.0.1:4174/__workflow (actual captures and motion recording).
Final 24-second forward scroll recording sampled 2,879 requestAnimationFrame
intervals: median8.3ms, p95 9.2ms, none above33.4ms. Reverse pass, rapid jumps,
chapter navigation, resizing and lower-section navigation follow in the recording.
This is browser scheduling with video capture active, not a GPU presentation
trace or a guaranteed frame rate on other hardware. No console/page errors.

Final captures succeeded at all four layouts using workflow-final-check.js.
Earlier multi-context screenshot attempts timed out; reusing the same test page
resolved capture reliability. Those incomplete runs are not claimed as passes.
Evidence screenshots in the gallery are from the initial browser pass; that
block is unchanged and its text/links were checked again against the final build.
Final mobile processor-to-output spacing measured46px; no overlapping nodes.
Keyboard Tab reached Trace input; Enter completed the trace. Keyboard activation
of the disclosure chapter selected act2; hidden workflow controls were inert.
Native wheel forward/reverse selected acts1/0. Direct #research load settled95px
below the viewport top after fonts/layout initialization. The first fast probe
sampled before the browser applied those events; the foreground, settled retest
passed (workflow-navigation.js).
The earlier verification below describes the unchanged lower-section refinement.

# Earlier depth refinement, September 6, 2026

## Build and scope

Optimized CRA build passes. Main JS 126.66 kB gzip; main CSS 9.96 kB gzip.
The gold-lettering enhancement dynamically loads existing Three.js modules near
recognition. Build directory is 11 MB including source maps and assets.
Two pre-existing lint warnings remain in data/exploits.js and pages/Exploits.js.
No dependency installs, backend changes, pushes or deployments.

Personal portrait removed from public assets; AS removed from hero/navigation.
The favicon and actual-browser social image were updated. A recoverable archive
of the preceding designer version exists; see RECOVERY.md. Downloads untouched.

## Actual browser checks

Headed Chrome 152 on this Mac; 1440×1000 desktop, 1365×768 laptop, 390×844 phone
emulation, DPR1. No physical phone, Safari or Firefox testing in this refinement.

- Captured and inspected hero, research, horizontal dossiers, gold recognition,
  projects, Amazon, speaking, about, education, HTB, Medium/HackerNoon, writing,
  and contact. Additional gold resolved / disclosure next-state frames.
- All three supplied photos load; resume returns HTTP 200. No duplicate IDs,
  personal portrait, AS graphic or horizontal document overflow at tested widths.
- No console/page errors in the normal desktop/mobile/recorded runs.
- Award details button reaches fully opaque content; direct #recognition reload
  settles approximately 95px below the top edge. Gold geometry loads successfully.
- Speaking controls change the preview to BSIDES. CVE arrow navigation works.
- Keyboard focus exposed a double-scroll problem in the desktop rail; vertical
  progression and native horizontal focus scrolling conflicted. The rail now
  resets horizontal scroll only while desktop vertical pinning owns progression.
  Retest focused records 7 → 1 → 4: all were inside the viewport, with horizontal
  window scrollLeft held at zero. The last record's bounds were x=769–1359px.
- Phone rail is native horizontal scrolling with arrows. No mobile pin spacers.
- Reduced-motion desktop: zero pin spacers, visible dimensional fallback title,
  fully visible award details, loaded career image, complete contact email.
- Simulated WebGL unavailability: fallback title and complete nomination/contact
  remain usable; HTML/CSS scroll enhancement remains (two desktop pins).
- Forced WebGL context loss on the live gold canvas restores visible fallback text.
- Forward continuous progression through the full 20,411px document, reverse
  progression, native wheel forward/back, rapid end/start jumps and laptop resize.
  The laptop research CTA remains within the opening viewport.

## Observed rendering schedule

The 18-second continuous forward pass recorded 2,149 requestAnimationFrame
intervals: median 8.3ms, p95 10.1ms, one interval above 33.4ms. Video recording was
active. This measures browser scheduling on this Mac, not a GPU/present trace,
independent FPS benchmark or a guarantee for other devices. Full run includes
reverse progression, rapid jumps and viewport resize after this sample interval.

## Contact integration

Three Jest tests pass: successful mocked JSON contract; loading/duplicate-submit
prevention and error recovery; 12-second timeout. Existing POST /api/contact
contract retained. Local Render origin remains unconfigured: form opens an email
draft. No live message was sent; Render delivery, uptime and CORS were not tested.

## Evidence and limits

Gallery: http://127.0.0.1:4174/__review
Frames/scripts: output/playwright/depth/
Recording: output/playwright/designer-motion.webm

User-supplied Penn State photo is 612×408 and visibly soft at large desktop size.
Amazon image is a watermarked stock preview: preserved, not erased; replace with
a licensed clean image for production. Amity JPEG XL was converted to JPEG.
No authentic speaking photograph is used; personal portrait removed by request.
Pwnie category/year use resume/public-profile evidence, not an official award
page independently verified in this refinement. No win or official trophy claim.

HackerNoon public author page inspected. Medium text access was robots-blocked;
HTB rank could not be independently confirmed through the available retrieval.
The supplied #34 global / #10 USA values are dated and labeled owner-reported.
No live-rank API or invented readership statistics. Existing article destinations
remain, and the three supplied profile URLs are linked directly.

Porsche reference: inspected opening and one actual scroll state. The opening had
its cookie notice; no complete mobile/navigation audit. Only composition principles
were adapted; no Porsche code or assets were copied.

## Exploits preview and archive refinement, 2026-09-12

Homepage: /#exploits contains one image-led preview link, not the full archive.
Dedicated route: /exploits. All 14 source records, the two existing card renderers,
and source-control handlers are unchanged; only their presentation is restyled.
The category index now uses native details disclosures and accessible filter buttons.

Verified in local Chrome at 1440x1000 and 390x844: preview-to-archive navigation,
return to the homepage anchor, 14 total / 7 kernel / 7 AI-infrastructure entries,
filtering, keyboard Enter expansion/collapse, mobile expansion, resume HTTP 200,
and no horizontal overflow. No page errors observed. Reduced motion removes image
transforms and retains all 14 entries. Native forward/reverse wheel input changes
and restores the section-local artwork transform. No new FPS/Lighthouse benchmark
or physical-device Safari test was performed in this pass. Source execution and
external exploit reproduction were not exercised.

Production build passes with the existing data/exploits.js template-string warning.
Nine Jest tests pass, including the two new preview/masthead tests. The five current
contact tests supersede the earlier contact notes above: without a backend origin,
delivery is disabled and there is no email display or email-app fallback.

Repeatable browser checks: output/playwright/check-exploits.js.
Screenshots: output/playwright/exploits-{home-desktop,home-mobile,desktop-top,
desktop-index,desktop-expanded,desktop-ending,mobile-top,mobile-index,mobile-expanded}.jpg.
One new lazy-loaded editorial WebP asset, approximately 232 KB. No new dependencies.
The design skill guided the shared editorial typography and artwork; the animation
skill limited movement to section-local parallax and short link feedback, with
stationary reading content and a reduced-motion fallback.

## Shared archive transition and category artwork, 2026-09-12

The homepage preview now uses client-side navigation with a native same-document
View Transition when supported. The actual artwork and EXPLOITS title have shared
snapshot names; the spatial transition is authored at 650 ms. The archive module
is still lazy-loaded, warmed on pointer entry/focus. Keyboard and reduced-motion
activation skip the animation. Unsupported browsers retain immediate navigation.
The underlying research records, renderers, source controls, and links are unchanged.

Browser validation: local Chrome, desktop 1440x1000, phone layout 390x844,
and resize during transition to 844x390. Captured before/middle/after frames;
checked actual named snapshot animations and completion. A sampled desktop run
took 42 ms from transition invocation to ready and about 799 ms to completion
including screenshot/automation overhead. A cold mobile double activation added
exactly one history entry and completed with no stale transition state. These
are timing observations, not a 60-fps GPU benchmark or a physical-device test.

Browser Back returned to /#exploits at approximately 95 px from the viewport top.
Keyboard activation focused the archive H1 without starting a transition. Removing
the View Transition API in the test still rendered all 14 entries. Resize interrupted
the animation cleanly; phone and landscape had no horizontal overflow. Reduced
motion removed category image transforms. Both category images decoded successfully;
category filters returned seven entries, and native keyboard expansion worked.
No page errors observed. Thirteen Jest tests and the production build pass; existing
data warning and test-only React Router future-flag notices remain.

Visual refinement removed doubled title snapshots and resolved the artwork crop
crossfade early while the shared geometry continues moving. No animation-frame wait
is used inside the View Transition callback: rendering is paused there and the
earlier attempted wait caused a browser timeout, caught and fixed during inspection.

Evidence: output/playwright/archive-transition-{before,mid,after}.jpg;
archive-category-{kernel,ai}.jpg and matching -mobile.jpg images.
Recording: output/playwright/archive-handoff.webm, native click and wheel input.
Repeatable checks: check-archive-motion.js followed by check-archive-navigation.js
in output/playwright. Recording contexts and the automation Chrome session closed
after verification. No deployment, external message, or exploit execution performed.

API references: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
and https://react.dev/reference/react-dom/flushSync . The animation skill guided
the spatial-consistency transition and interruptibility. The imagegen skill supplied
exploits-ai-layers.webp; its complete generation prompt and attribution are recorded
in public/editorial/credits.txt. Added image payload: approximately 122 KB; no added
runtime dependencies. Safari and GPU frame pacing remain unverified in this pass.
