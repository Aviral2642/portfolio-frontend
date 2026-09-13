# Workflow → investigation → disclosure

Approved targeted opening, September 6, 2026. Design variance 8 / motion 8 /
density 4. Existing violet, Anton/Manrope and editorial identity retained.
The purpose is explanation and spatial continuity, for an occasional portfolio
visit. No fictional environment, stock sculpture, fake terminal or live exploit.

## Architecture

WorkflowOpening.js is an isolated Framer Motion 10 component. The angled interface
is live semantic HTML with CSS perspective, extruded edges, connections, selectable
input and a local trace action. It is CSS 3D, not a WebGL model or product screenshot.
No generated raster assets are needed for this user-approved live-interface concept.

useWorkflowProgress reads native scrolling into one authoritative motion value.
It filters wheel steps with a45ms time constant and settles within140ms of the
last input; anchors, chapter navigation, resizing and boundary exits synchronize
immediately. It never changes native scrolling or traps input. workflowTimeline.js
defines physical layer positions and composition. Full transform strings are
composed without per-frame React state: React updates only when the act changes.
GSAP continues to own the existing later sections, never these hero properties.
The existing design and animation skills inform purposeful motion and fallbacks;
the user-approved palette, dark theme and evidence retention override aesthetic
defaults that would otherwise replace existing content or flatten this sequence.

Full-frame correction: native420svh scroll region; sticky viewport starts at0,
with HTML navigation above the76px inset stage. Viewport-based uniform scale3d
replaces fixed760px composition plus competing zoom/short-screen scales.
The first input moves the workflow. Seven spatial waypoints at0/.14/.34/.54/.74/
.90/1 use continuous-velocity cubic Hermite interpolation. Slow spatial drift
continues through reading intervals; there are no frozen scroll bands. Reading
planes are selected at .23 and .74. useReadingReveal owns their interruptible
650ms entrances / 250ms exits, so a large wheel delta cannot compress a reveal
into a single frame. Explicit chapter/debug seeks are instant; reduced motion
removes the transition. Geometry remains scroll-controlled, with no forced
playback, image-frame sequence or scroll lock. Very large native
scroll/anchor jumps may intentionally skip intermediate positions; forcing every
state to dwell would require scroll trapping, which this implementation avoids.
Input trace is a 1.4s linear path reveal, local only. No exploit code or network call.

Safari overlap correction: the old cover at translateZ(1px) was behind nodes at
translateZ(10px). Outgoing interface now fades from .59–.70, is visibility:hidden
at .70, and the cover wipes only from .71–.88. Its depth is 24px. The interface
forms an isolated flat compositing group. Correctness does not depend on the
cover obscuring controls; reverse scrolling restores them only after it closes.

## Honest design comparison

The agreed order is 1 → 3 → 2, not three interchangeable hero treatments:
angled interactive AI workflow, investigation of underlying authority, then a
Langflow disclosure example. The first concept is directly represented. The
investigation is a simplified CSS-depth metaphor, not a detailed technical model
or a complete realization of the earlier visual ambition. Its formerly obscured
boundary labels now occupy the exposed edges. The disclosure retains real evidence
and links, without the unsupported claim of taking over almost every AI agent.
This patch corrects the handoff; it is not evidence that every creative promise
has been fulfilled.

Phone <=760px: readable vertical workflow nodes and normal document-flow acts,
without desktop camera travel or pinning. Reduced motion: stationary complete
presentation. Core opening does not require WebGL. Native cursor and navigation
remain; invisible act controls are inert. Existing #research skips to evidence.

## Refinement controls

Open /?heroDebug to pause at arbitrary normalized progress, then Follow scroll.
Edit workflowTimeline.js for camera-equivalent rotation/scale/translation and
layer separation; edit WorkflowOpening.js for text entry/exit intervals.

## Preservation

Latest checkpoint: ../portfolio-backups/pre-full-frame-workflow-20260906.tar.gz.
Original checkpoint: ../portfolio-backups/pre-workflow-20260906.tar.gz (source, editorial
metadata and social image). Archive listing inspected before replacement.
Original d-research-story through DisclosureRail compared byte-for-byte: unchanged.
All JSX from NominationReveal onward compared byte-for-byte: unchanged.
Langflow CVE identifier, CISA KEV, issue, contribution, impact, Medium article,
official advisory and Sysdig links retained. No push, deploy or backend write.
