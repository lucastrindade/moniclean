---
name: responsive-check
description: Verify any visual, layout, or CSS change to this site (index.html, css/*.css) across multiple real screen widths before calling the work done. Use this whenever adding, moving, or restyling a section, changing font sizes/spacing, or touching anything under css/ — not only when the user explicitly asks to "check responsiveness." A change that looks correct at one viewport can be silently broken at another; checking just mobile or just desktop is not enough.
---

# Responsive check for the Moniclean site

This is a static HTML/CSS/jQuery site with no build step. Layout bugs here are cheap to introduce and easy to miss, because the two most common ways of checking a change (one screenshot, or "I read the CSS and it looks right") each miss a different class of bug. Do both, at more than one width, before saying a visual change is finished.

## Why this exists

Two real bugs shipped in one session because of shortcuts this skill would have caught:

1. A change was verified only at mobile width (375px). It looked perfect there. The same change broke on a real MacBook because the bug only manifested at wider viewports.
2. A layout appeared completely broken (an element rendered at 0 width, positioned outside its container) — which looked exactly like a CSS bug and nearly got "fixed" as one. It was actually the preview browser's own viewport silently collapsing to 0px after a resize call. The real CSS bug it was masking (see footgun below) went unverified as a result.

Both are avoidable by checking more than one width, and by never trusting a screenshot or a layout measurement without confirming the viewport itself is sane.

## This codebase's specific footgun: floats without clearfix

Most row-level layout in `css/style.css` and `css/responsive.css` uses `float: left; width: 100%;` instead of flexbox or grid — a legacy pattern, but it's the load-bearing convention throughout the site. Floated 100%-width rows stack fine against each other. The break happens when a **new element that is not itself floated** is placed directly after one of these rows, inside the same container.

- Adding a `<div>`, `display:flex`, or `display:grid` container right after a `float:left; width:100%;` sibling can render with the wrong width, be mispositioned, or (seen in practice) collapse to 0 width — and this may only show up at certain viewport widths, not all of them.
- Fix: give the new element `clear: both;` (or make it a float itself, matching its siblings, if that fits the pattern better).
- Before adding any new block after an existing row in this codebase, grep the preceding siblings' CSS for `float: left`. If you find one, clear it.

## Checklist — run this after any layout/CSS change

1. **Start the site's own preview** (`preview_start` with the project's dev server config, or a plain static server) and open it in the Browser pane.
2. **Check at least these four widths**, not just one:
   - Mobile — 375×812 (iPhone-class)
   - Tablet — 768×1024 (iPad-class)
   - Laptop — 1440×900 or 1512×982 (MacBook-class — the width real feedback on this project has come from)
   - Desktop — 1920×1080
3. **At every width, before trusting anything else, confirm the viewport actually resized:**
   ```js
   window.innerWidth  // must equal the width you just asked for
   ```
   If it doesn't match (e.g. reads 0), the preview tool is in a bad state — re-resize or open a fresh tab before drawing any conclusion about the page. A collapsed viewport produces layout numbers that look identical to a real bug; don't let it fool you twice.
4. **Check both ways, not just one:**
   - **Screenshot** each width — this is what the site owner actually sees, and catches visual issues (overlap, wrapping, color, spacing) that measurements alone won't.
   - **Measure the DOM** for the specific element(s) you changed — `getBoundingClientRect()` and `getComputedStyle()` on the changed element and its container catch structural bugs (0 width, off-container position, unexpected float/clear interactions) that a screenshot at one moment might not make obvious, especially if the element is still technically "on screen" but wrong.
5. **If something added a block after a floated row**, specifically check its computed `width` and bounding rect — this is where the footgun above tends to surface, and it's worth checking even if the screenshot looks fine, since the bug can be width-dependent.
6. Only after this passes at all four widths — screenshot *and* measurement, viewport confirmed sane at each — call the visual change done.
