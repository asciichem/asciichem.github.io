/**
 * Keyboard access for scrollable regions (WCAG 2.1.1 / 2.4.3 — the
 * axe `scrollable-region-focusable` rule).
 *
 * Any element whose computed overflow is auto/scroll and whose content
 * actually overflows gets tabindex="0", so keyboard users can reach it
 * and scroll it with the keyboard. Elements that are already focusable
 * (textareas, iframes, …) or already carry a tabindex are left alone,
 * and content that fits is never given a tab stop — the attribute only
 * appears where scrolling is real.
 *
 * Progressive enhancement: runs at load and again on every Astro
 * page-load, so view transitions are covered.
 */
const NATURALLY_FOCUSABLE =
  "a, button, input, textarea, select, iframe, [contenteditable]";

function isScrollable(el: Element): boolean {
  const style = getComputedStyle(el);
  const scrollsX = style.overflowX === "auto" || style.overflowX === "scroll";
  const scrollsY = style.overflowY === "auto" || style.overflowY === "scroll";
  if (!scrollsX && !scrollsY) return false;
  return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
}

function markScrollables(): void {
  for (const el of document.querySelectorAll<HTMLElement>("body *")) {
    if (el.hasAttribute("tabindex")) continue;
    if (el.matches(NATURALLY_FOCUSABLE)) continue;
    if (isScrollable(el)) el.setAttribute("tabindex", "0");
  }
}

markScrollables();
document.addEventListener("astro:page-load", markScrollables);
