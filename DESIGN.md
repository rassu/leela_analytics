---
name: Leela Analytics
description: Open Workshop — thoughtful AI and product engineering, expressed with natural illustration and precise typography.
colors:
  ink: "#202a24"
  muted: "#495d54"
  paper: "#fff"
  blue: "#e1ebec"
  soft: "#f5f6f2"
  green: "#263c31"
  line: "#b7c4bd"
  focus: "#758c46"
  error: "#972f24"
  masthead: "#000"
  action: "#253c2f"
  action-hover: "#354f3f"
  action-active: "#172a20"
  action-disabled: "#516459"
  contact: "#e7ede4"
  field: "#f9fbf7"
  field-border: "#8f9e91"
  text-link-rule: "#8b9a8f"
  forest-text: "#f4f6ed"
  forest-rule: "#65776a"
  technology: "#eff4d8"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(2.8rem,5vw,5.1rem)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(2.1rem,3.3vw,3.1rem)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-.035em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-.015em"
  body:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "18px"
    lineHeight: 1.6
  button:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: ".94rem"
    fontWeight: 500
    lineHeight: 1.6
  text-link:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: ".95rem"
    fontWeight: 500
    lineHeight: 1.6
  field:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.5
  label:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: ".88rem"
    fontWeight: 500
    lineHeight: 1.6
  navigation:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: ".9rem"
    lineHeight: 1.6
rounded:
  control: "3px"
spacing:
  section-block: "100px"
  section-inline: "5.3%"
  section-block-tablet: "72px"
  section-block-mobile: "56px"
  section-inline-mobile: "22px"
  field-gap: "22px"
  field-label-gap: "8px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "15px 21px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-primary-active:
    backgroundColor: "{colors.action-active}"
  button-primary-disabled:
    backgroundColor: "{colors.action-disabled}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.text-link}"
  form-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.field}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    width: "100%"
  navigation:
    backgroundColor: "{colors.masthead}"
    textColor: "{colors.paper}"
    typography: "{typography.navigation}"
  stack-row:
    backgroundColor: "{colors.green}"
    textColor: "{colors.forest-text}"
    padding: "29px 0"
---

# Design System: Leela Analytics

## Overview

**Creative North Star: "Open Workshop"**

A capable, approachable engineering practice: clear spaces, natural illustration and readable, deliberate typography. The approved geometric LEELA identity supplies precision; the open-workshop illustration brings people, plants and an organic character to the experience.

Use the full supplied mark on the black masthead and the compact supplied mark in the light footer. Preserve the assets' proportions and geometry. The pale mineral-blue hero and dark forest infrastructure section establish the main tonal contrast; editorial rows and generous space carry the detail.

**Key Characteristics:**
- Natural illustration alongside an unchanged geometric identity.
- Manrope headings and Public Sans reading text.
- Flat tonal sections, fine rules and compact rectangular controls.
- Clear reading order and visible interaction states.

This is a scan of `src/styles.css` and `src/site.mjs`, recorded after explicit approval of the rendered design and copy. Frontmatter values are normative; contextual overrides below reflect the source. No new color ramps or numerical spacing scale have been invented.

## Colors

### Primary

Forest `green` anchors infrastructure; `action` is the slightly different button fill already present in the source. Pale `technology` text distinguishes infrastructure names without adding badges or logos. The component states retain their separate source colors.

### Secondary

Mineral `blue` creates the hero and page-heading atmosphere. Pale `contact` frames the enquiry form; `soft` alternates with `paper` to pace longer pages.

### Neutral

`ink` is the main text, `muted` supports descriptions, and `line` separates content rows. The `masthead` is black with white navigation. Fields use their own pale surface and border. `focus` marks keyboard position; `error` marks invalid input and failed submissions.

**The Tonal Structure Rule.** Distinguish sections with the existing surface colors, space and fine rules; keep the interface free of shadows.

## Typography

Manrope carries headings and identity-adjacent labels. Public Sans carries paragraphs, navigation and controls. Both are self-hosted variable fonts with Arial and sans-serif fallbacks and `font-display: swap`; there is no mono face.

Use the frontmatter display, headline and title roles for the established hierarchy. The hero tightens display line height to `1.07`; at widths up to `850px` its heading is `3.25rem`, and up to `760px` it uses `clamp(2.65rem,11vw,3.8rem)` with `1.08` line height. Article headings have their own `clamp(2.5rem,4.5vw,4rem)` and `1.12` line height. These are contextual sizes, not a new type scale.

Body text changes to `16px` with `1.65` line height at the mobile breakpoint. Paragraphs cap at `65ch`; article prose uses `66ch` outside the article's own width rule. Keep sentence case, balanced headings and descriptive link text. Do not turn short labels into an all-caps decorative layer.

## Layout

Sections use the documented block and inline spacing. Introductory sections generally use two equal columns with a `10%` gap. The hero uses a `43% / 57%` split, becoming `46% / 54%` at `850px`, then a vertical composition at `760px`. Its illustration keeps its natural aspect ratio and is allowed to extend into the horizontal gutter.

At `850px`, section block spacing reduces to the tablet value. At `760px`, content becomes a single-column reading order with the mobile section spacing. Form pairs become a single column by `850px`; process steps retain a small numbered column on mobile. Navigation remains visible rather than introducing a hidden menu.

Wide-screen padding adjusts from `1600px`, using the source's `1440px` content basis; article containers cap at `960px`. The additional `1000px` and `350px` breakpoints tighten navigation and gaps. Keep these observed breakpoints rather than substituting a framework's defaults.

## Elevation & Depth

There are no shadows. Depth comes from the illustrated scene and alternating flat backgrounds; the UI uses borders and tonal contrast. Focus is a clear outline (`3px` in `focus`, offset `5px`), never a glow.

Arrows move horizontally by `4px` on hover using a `.25s cubic-bezier(.16,1,.3,1)` transition. Button backgrounds transition over `.2s`; there is no reveal or parallax system. Under `prefers-reduced-motion: reduce`, scrolling is immediate, transitions are removed and arrows do not move.

## Shapes

Controls have the existing `control` radius. The overall composition is rectilinear, with thin rules and modest corners rather than pill-shaped containers. Arrow SVGs use the supplied path and a `1.5` stroke. The full wordmark's sharp geometry and the compact mark's circular silhouette are identity assets, not instructions to redraw either asset.

**The Identity Rule.** Preserve the supplied marks; use organic illustration to complement their geometry without altering it.

## Components

### Primary button

A compact, confident action: forest fill, white text, a small corner radius and an inline arrow. Use the frontmatter padding and state colors, with a `24px` internal gap and `52px` minimum height. Keyboard focus uses the global outline. Disabled buttons show the existing muted fill and waiting cursor, and their arrows stay still. Mobile text is `.9rem`; the source's contextual top margin is smaller in the contact form.

### Text link

An editorial action with an inline arrow, an `18px` gap and a single bottom rule. It has `6px` bottom padding and a `28px` default top margin; hover darkens the rule to `ink`. Retain keyboard focus and reduced-motion behavior. Use plain underlined links within body prose.

### Form field

A pale input surface with a `1px` border, associated visible label and the frontmatter padding. Inputs have a `48px` minimum height; textareas have a `140px` minimum and resize vertically. Hover and focus darken the border to `green`; keyboard focus also receives the outline. Invalid fields use `error` and an adjacent message. Empty error elements are hidden. Keep mobile input text at `16px`.

Use `name`, `email`, optional `company` and `message` as implemented, with the source autocomplete and validation attributes. Submission status is a polite live region; errors and success are communicated in text as well as color. Do not place implementation details in field labels.

### Navigation

Visible text links sit beside the full mark on the black masthead. Desktop links have a `44px` minimum height and `30px` gap; hover and the current page are underlined. At mobile widths the mark sits above a compact, evenly distributed link row. Keep the skip link and semantic navigation label. The compact footer mark belongs to a separate light signature treatment.

### Infrastructure stack row

A flat, rule-separated row on the forest surface. Desktop columns are `1fr / 2fr`, separated by `6%`, with the frontmatter padding and a `1px` `forest-rule` top border. The label is Manrope at `1.13rem` and weight `600`; technology text is Public Sans at `1.12rem`, weight `500`. Supporting text is smaller and quieter. At `760px`, the row stacks, uses `25px` vertical padding and puts `12px` between label and detail. This is informational content with no hover or selection behavior.

## Do's and Don'ts

### Do:
- Do preserve the supplied full and compact marks, their proportions and their established placements.
- Do pair natural illustration with precise typography and a clear reading order.
- Do reuse the measured source tokens and contextual breakpoints.
- Do keep keyboard focus, visible labels, textual errors and reduced-motion behavior.
- Do describe capabilities and verified infrastructure in plain language while keeping private portfolio names out of public copy.

### Don't:
- Don't add shadows, decorative gradients or floating-card treatments to this flat system.
- Don't regenerate the logo, replace it with typed text or round off its geometry.
- Don't introduce arbitrary token ramps, spacing scales or component variants.
- Don't turn technology names into partner endorsements or add unverified client proof.
- Don't add motion that is required to read, navigate or submit the form.
