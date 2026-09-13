---
name: Aviral Srivastava — Designer Portfolio
description: Graphic-heavy security research portfolio in near-black, electric purple, gold nomination typography, and editorial motion.
colors:
  near-black: "#0b090f"
  reading-white: "#f0edf1"
  muted-lilac: "#b4aebc"
  electric-purple: "#a077ff"
  editorial-purple: "#a078f5"
  selection-magenta: "#cf42dd"
  research-magenta: "#ea54ed"
  divider: "#39323f"
  about-surface: "#151119"
  contact-ink: "#170f25"
  light-surface-hover: "#241535"
  dark-surface-focus: "#edb8ff"
  light-surface-focus: "#201329"
  project-ink: "#2e1d48"
  project-light-ink: "#eee7fb"
  atlas-ink: "#7844c9"
  poster-ink: "#6e3c9e"
  project-pilot: "#b49ae2"
  project-atlas: "#e3d9ef"
  project-forge: "#bc46c6"
  project-kernel: "#44404c"
  project-polymorphic: "#80729c"
  project-emulation: "#c5b2e9"
  speaking-paper: "#d1c5e0"
  writing-purple: "#a378ee"
  writing-paper: "#d8cfe1"
  input-purple: "#b18bf8"
  flow-white: "#fff"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontSize: "min(23vw, 34svh)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(68px, 8.5vw, 155px)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "25px"
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    letterSpacing: "0.07em"
  research-meta:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    letterSpacing: "0.04em"
rounded:
  square: "0"
  stamp: "50%"
spacing:
  link-block: "8px"
  input-inset: "12px"
  cover-inset: "24px"
  poster-inset: "36px"
  section-heading-gap: "70px"
  desktop-gutter: "5.2vw"
  mobile-gutter: "6vw"
components:
  button-primary:
    backgroundColor: "{colors.reading-white}"
    textColor: "#100c18"
    rounded: "{rounded.square}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.electric-purple}"
    textColor: "#100c18"
  link-editorial:
    textColor: "{colors.reading-white}"
    padding: "8px 0"
  link-editorial-hover:
    textColor: "{colors.electric-purple}"
  button-submit:
    backgroundColor: "{colors.contact-ink}"
    textColor: "#eee4fc"
    rounded: "{rounded.square}"
    padding: "14px 20px"
  input-contact:
    backgroundColor: "{colors.input-purple}"
    textColor: "{colors.contact-ink}"
    rounded: "{rounded.square}"
    padding: "12px"
  navigation:
    backgroundColor: "{colors.near-black}"
    textColor: "{colors.reading-white}"
    height: "76px"
    padding: "0 3vw"
  credential:
    textColor: "{colors.reading-white}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
  project-cover:
    backgroundColor: "{colors.project-pilot}"
    textColor: "#130d1c"
    rounded: "{rounded.square}"
    padding: "24px"
---

# Design System: Aviral Srivastava — Designer Portfolio

## Overview

**Creative North Star: "Research in Electric Type"**

A graphic-heavy designer portfolio built around near-black space, electric-purple typography, layered research dossiers, and large editorial spreads. Anton turns identity and research into visual material; Manrope gives the evidence, professional background, and actions a calm reading voice. The palette and visual language follow the user-pinned September 6 brief; the North Star is a descriptive label for that existing direction, not a separately approved concept.

The implemented system is code-first. Its authority is PRODUCT.md, the design-contract in public/index.html, and the current src/designer implementation, supported by the desktop and mobile review frames in output/playwright. No approved image comp exists. Older world concepts and global theme tokens do not define this surface.

**Key Characteristics:**

- Oversized condensed type with deliberate line breaks and close leading.
- Near-black reading sections alternating with full-width purple editorial spreads.
- Source-backed research graphics, supplied campus photographs, and direct evidence links.
- Flat rectangular controls, fine rules, and a restrained circular nomination stamp.
- Native scrolling with varied, optional motion and a small fluid pointer enhancement.

## Colors

Electric purple carries both emphasis and large surface changes; muted lilac supports reading, while magenta provides a selective graphic interruption.

### Primary

- **Electric Purple** (`electric-purple`, source `--d-purple`): hero name, emphasized section-title words, active project rows, and dark-surface link hover.
- **Editorial Purple** (`editorial-purple`): Langflow poster, Pwnie nomination spread, and contact ending. This is a distinct implemented value from the text accent.
- **Writing Purple** (`writing-purple`): the first publication cover.

### Secondary

- **Selection Magenta** (`selection-magenta`, source `--d-hot`): text-selection background.
- **Research Magenta** (`research-magenta`): the angled rule crossing the Langflow graphic.
- **Project cover colors**: six individual cover backgrounds run from pale lilac through magenta to graphite. Keep their per-project identity rather than normalizing them into one generic card.

### Neutral

- **Near Black**, **Reading White**, **Muted Lilac**, and **Divider** map to `--d-bg`, `--d-text`, `--d-muted`, and `--d-line` in the scoped `.designer` root.
- **About Surface** lifts the background section by a small tonal change.
- **Speaking Paper** and **Writing Paper** are light lavender editorial grounds.
- **Contact Ink** gives the contact spread and fields their dark reading color.

The frontmatter records actual values, including literal component colors; it does not claim every value is already a CSS custom property. The older Orbitron/Inter theme in GlobalStyles.js remains outside the designer's visual authority.

**The Surface Contrast Rule.** Choose text and focus colors for the surface beneath them. Light purple spreads use dark ink for actionable states.

The trailing correction rules in designer.css are authoritative: navigation is opaque near-black; FLOW is white; recognition/contact underlined links hover in `light-surface-hover`; recognition links and contact links, buttons, summaries, inputs, and textareas use `light-surface-focus`. Other designer controls use a 3px `dark-surface-focus` outline with 6px offset. Project second lines use `project-ink`, with a light `project-light-ink` exception for KernelGhost. AttackAtlas retains `atlas-ink` because its earlier selector is more specific. The speaking poster's TO uses `poster-ink`. These are cascade facts, not a blanket contrast certification; screenshots may predate a correction.

## Typography

**Display Font:** Anton, sans-serif; local regular font, weight 400.  
**Body Font:** Manrope, sans-serif; local variable font, weights 200–800.  
**Label/Mono Font:** JetBrains Mono, monospace, reserved for research identifiers and metadata.

Anton supplies compact, emphatic graphic shapes. Manrope handles body text, evidence headlines, navigation, project titles, and actions without imitating a terminal. Local font declarations in src/styles/GlobalStyles.js use font-display: swap.

### Hierarchy

- **Identity:** desktop first name uses the display token; surname uses min(14.5vw, 22svh) with 1.13 leading. Mobile uses 25vw and 15.1vw respectively.
- **Section headline:** the headline token, weight 400; emphasized words are purple and remain upright. At 601–959px the size becomes 9.8vw; at 600px and below, 16vw with 1.01 leading.
- **Editorial display:** Langflow uses clamp(130px, 24vw, 420px); PWNIE uses 25vw, NOMINEE 17vw; contact uses 25vw, increasing to 29vw on mobile.
- **Reading headlines:** Manrope spans 22–42px according to component. Evidence subheads use the title token; project rows use clamp(21px, 2.45vw, 38px) at weight 550.
- **Body:** Manrope generally 13–16px with 1.6 inherited leading; long biography and research explanations remain visually subordinate to their headlines. Research summary width is capped at 420px, archive prose at 750px.
- **Labels:** Manrope generally 9–12px; mobile metadata can reach 8px. Use these sizes for supporting labels, not primary reading content.
- **Actions:** Manrope 14px, weight 650, with an explicit underline rule and diagonal arrow.

## Layout

Use a native vertically scrolling document. Full-width colored spreads interrupt spacious dark reading sections. Standard content gutters are 5.2vw desktop and 6vw at 600px or below; navigation uses 3vw desktop. Major desktop section spacing is commonly 100–145px and compresses to roughly 60–75px on mobile. There is no universal fixed-width container.

Desktop research uses a 1:1 grid with an 11vw gap and sticky summary; projects use 1.2:1 with a 7vw gap and sticky preview; speaking uses 1:1 with an 8vw gap and sticky poster; biography uses 1:1.1 with a 10vw gap. Writing uses 1.2:1 with an 8vw gap and a 90px offset on the second feature.

At 959px and below, gaps and type scale down. At 600px and below, the editorial grids stack, project preview moves above its list, sticky reading elements become static, the campus photographs fill their image panels, and the contact form becomes one column. Project covers change from square to a 1.25 aspect ratio. The mobile header is 84px tall in the final cascade, with brand/resume on the first row and four section links on the second. Mobile hero top padding is 119px; section anchors retain 95px scroll margin.

At 960px and above, the hero uses viewport-aware type and a full-height composition. On shorter desktop viewports, the layered dossiers shrink to leave the identity and action visible. The research visual grows on wide displays. The default research visual is 650px capped at 78svh, 480px on tablet, and 340px without that cap on mobile.

Native details/summary archives compact secondary content without removing it. Opening an archive or contact form refreshes ScrollTrigger measurements. The fixed navigation and immediate resume/research links remain part of the composition.

## Elevation & Depth

The designer surface uses flat editorial layering, not a card-shadow scale. Fine borders, alternating grounds, cropped type, and overlap establish depth. Layered research dossiers replace the removed AS mark. Gold beveled lettering uses a progressively loaded Three.js enhancement. Campus photographs supply real places, with foreground typography moving separately from imagery. No portrait is used.

Fluid ink is a transparent screen-blended layer at opacity .33 and z-index 20; fixed navigation is above it at z-index 30, and the skip link uses 100. The ink layer never intercepts pointer events.

## Shapes

Rectangles and hard corners dominate posters, project covers, buttons, inputs, and credential tags. Dividers and editorial-link underlines are 1px. The nomination stamp is the deliberate circular exception: a 2px border, stacked year, and slight rotation. Inline outline arrows provide direction; do not replace them with an unrelated icon language.

Cropping and clip-path belong to the graphic and motion vocabulary. Real headings and readable research copy remain semantic HTML around decorative, aria-hidden art.

## Components

### Navigation and actions

A fixed, opaque near-black bar holds the Manrope Aviral. home link, four native section anchors, resume access, and the desktop fluid toggle. On mobile the toggle is hidden and the navigation wraps into two rows. The skip link appears on focus. The Ink button reports aria-pressed and controls only the fluid effect; it does not disable GSAP section motion.

The primary research action is a square pale rectangle with dark text and arrow, 13px 20px padding and 188px minimum width; mobile uses 12px 15px and 167px. Hover changes its background to electric purple. Editorial links use a currentColor underline and 22px arrow gap; hover shifts the arrow by 3px right and 3px up. Preserve visible keyboard outlines.

### Langflow research spread

An expanding, full-width purple typographic poster introduces source-linked reading. Decorative LANG/FLOW lettering, a magenta rule, and small research metadata are followed by the actual explanation and advisory/evidence links. Desktop allows a bounded 360px scroll pin; mobile and reduced motion do not pin. The graphic does not replace the readable disclosure account.

### Nomination spread

Large PWNIE/NOMINEE type, a circular 2026 stamp, dark ink, and fine rules carry the recognition. Preserve nomination status and direct resume/public-profile evidence. No winner language or invented award art.

### Project list and covers

Each real repository row selects its graphic cover on mouse enter and keyboard focus. The selected row gains purple text, 18px left inset (8px mobile), and a rotated arrow. Covers use project-specific color, Anton title, a field of parallel lines, and small category/footer labels. The preview announces updates through a polite, atomic live region. Each row and preview action remains a real repository link; touch use does not depend on hover. The cover and descriptive text are a visual representation of the existing projects, not replacement project data.

### Speaking, background, and writing

The speaking deck switches between three source-backed conference posters beside the ruled talk list. The personal portrait and AS graphic have been removed at the owner’s request. Biography credentials are square outlined tags, not controls.

Writing uses two typographic publication covers followed by source titles and descriptions. Publication links remain functional without motion. Hover brightens the artwork to 1.06 via filter; CSS does not own its transform. Publication, article, background, and disclosure indexes use native expandable archives.

### Contact and archives

The purple contact ending is a full-scale LET’S TALK mailto action, backed by a readable address, LinkedIn, GitHub, and resume links. The optional native-details form uses square purple fields with visible labels, a dark submit button, and a live status region. It submits through the configured endpoint or opens an email draft when no endpoint exists; the draft state is not presented as successful delivery. Busy, error, and success states preserve feedback. The submit button dims to .5 opacity and uses a wait cursor while sending.

Archive summaries use a right-aligned plus that rotates 45 degrees when open. Desktop summary type is 18px with 24px vertical padding; mobile is 15px with 19px padding.

### Motion ownership and fallback

DesignerPortfolio.js owns GSAP transforms, clip-path sequences, ScrollTrigger scrubbing, title entrances, research pinning, campus parallax, and writing composition. It creates media-scoped animation contexts and reverts them on unmount. Font readiness refreshes geometry and restores hash targets.

CSS owns short color/filter/arrow transitions, the .45s coverReveal animation, and archive-state rotation. Writing art uses only a filter transition so CSS does not compete with GSAP for its transform. Reduced-motion CSS disables animation and transitions and makes research summary, project preview, and speaking poster static; GSAP's no-preference queries exclude those users entirely.

FluidInk.js alone owns the custom WebGL2 pointer solver and resource lifecycle. It is eligible only at 960px or wider with a fine pointer and no reduced-motion preference. It responds to mouse movement, idles after 2200ms, pauses in hidden documents, and cleans up GPU resources/listeners on disposal or context loss. The simulation grid is 384×256; output width is capped at 1280px. Missing WebGL/extensions or a disabled Ink toggle leaves the HTML portfolio usable. This enhancement is not the visual concept, a replacement cursor, or an access requirement.

## Do's and Don'ts

### Do:

- Do preserve the user-pinned near-black/electric-purple editorial identity and local Anton/Manrope pairing.
- Do use real research, project, nomination, campus, and publication evidence as the graphic subject.
- Do keep direct resume, research, contact, keyboard, and mobile access visible and usable.
- Do preserve final cascade overrides and test state colors against the actual component surface.
- Do give GSAP, CSS, and WebGL distinct motion ownership and honor reduced-motion preferences.

### Don't:

- Don't revive the observatory, navigable world, mandatory intro, fake terminal, or unexplained floating objects.
- Don't describe the Pwnie nomination as a win or publish unsupported professional claims.
- Don't turn the portfolio into a repeated generic card grid or replace authentic portraiture with a generated likeness.
- Don't make fluid ink, hover, or scroll animation necessary to reach content or follow a link.
- Don't treat old global theme tokens or pre-correction screenshot colors as the designer surface's authority.
