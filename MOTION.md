# Motion ownership

The new WorkflowOpening component supersedes the former hero dossier and Langflow
poster animations. Framer Motion owns the complete opening, CSS supplies its 3D
perspective, and the existing GSAP sections below retain separate ownership.
See WORKFLOW.md for the authoritative three-act score and reading holds.

Native document scrolling; no Lenis, camera route, scroll trap or mandatory intro.

## September 6 depth refinement

DepthSections.js owns its own scoped GSAP contexts: a desktop horizontal CVE rail,
gold award reading intervals, photo/foreground parallax, speaking-ticket depth,
rank-number masks, and staggered Medium/HackerNoon spreads. Main page animations
do not target those same transforms. The rail falls back to native swipe/arrow
navigation on phones and with reduced motion. Keyboard focus maps to the desktop
scroll position; automatic horizontal focus scrolling is suppressed only while
that rail is driven by vertical scroll.

GoldType.js progressively imports existing Three.js modules near recognition.
It builds editable beveled Anton geometry, uses a generated room environment,
caps DPR at 1.5, and draws on scroll/pointer/resize rather than a perpetual loop.
Its sole progression source is the award ScrollTrigger ref. Outgoing and incoming
words have distinct entry/exit thresholds to avoid unreadable overlap. HTML owns
all nomination facts and links. Phone/reduced-motion views retain dimensional CSS
lettering and complete nomination text. No downloaded models, bloom or video.

Career and education use supplied photographs, independent foreground typography,
and quiet caption intervals. HTB ranks are a dated owner-reported snapshot, not
a fabricated live dashboard. Source profiles are ordinary links, not embedded
trackers or paid services. No personal portrait or AS monogram remains.

GSAP matchMedia/context owns scroll motion and cleans up on unmount:
- Hero: masked name reveal; layered research dossiers separate with scroll.
- Langflow: opposing text movement and expanding graphic mask. A desktop-only
  360px pin holds the poster; scale changes happen on its child, not the pin.
- Research: native CSS sticky summary beside ordinary readable evidence.
- Recognition: a gold NOMINATED → PWNIE handoff, then a stable category/year reading interval.
- Projects: cover line rotation responds to scroll. React owns discrete selected
  project state; CSS masks each replacement on hover or keyboard focus.
- Speaking: three selectable conference prints settle in depth; talk links stay stable.
- About: typographic manifesto replaces the portrait at the owner’s request.
- Writing: two covers enter at different depths/rotations.
- Contact: full-scale type settles into the closing email action.

GSAP owns each animated transform; CSS owns hover color/filter and discrete cover
entry. No per-frame React state. Every anchor retains ordinary browser semantics.
Font load, resize and expanding details refresh ScrollTrigger measurements.

Editorial timing: 850–1050ms expo.out, interface 180–220ms. Scroll scrub is direct
(no delayed chasing/snap). Reduced motion removes all continuous, entrance and
scroll animation and unpins the page. Mobile gets shorter, unpinned compositions.

Optional pointer ink is a standalone WebGL2 stable-fluid solver, not a page scene.
384x256 float buffers, 8 pressure iterations, output width capped at 1280 pixels.
It runs only for fine pointers at >=960px, stops 2.2s after input, pauses on hidden
pages, releases GPU resources on disable/unmount, and fails without hiding content.
The native cursor and pointer hit testing are unchanged. An Ink on/off control is
available on desktop. This is inspired by the supplied Pavel Dobryakov reference;
no demo UI, tracking or promo code is included.
