import { BlockerSettings } from "../settings-config";
import { ATTRIBUTES, BlockDecision } from "./compute-blocks";

const OVERLAY_ID = "dfr-blocker";
const DYNAMIC_STYLE_ID = "dfr-dynamic-style";
const ATTRIBUTE_PREFIX = "data-dfr-";

/**
 * Selectors for video-like posts. Hidden via dynamically generated rules
 * (rather than blocker.css) so each rule can carry per-subreddit whitelist
 * exemptions.
 */
const VIDEO_POST_SELECTORS = [
  'shreddit-post[post-type="video"]',
  'shreddit-post[post-type="gif"]',
  'shreddit-post[post-type="link"][content-href*=".gif"]',
  'shreddit-post[post-type="gallery"]:has(img[src*=".gif"])',
  'shreddit-post[domain*="redgifs.com"]',
];

/** The overlay lives under <html>, outside <body>, so Reddit's React never removes it */
const ensureOverlay = (): HTMLElement => {
  const existing = document.getElementById(OVERLAY_ID);
  if (existing) return existing;

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  document.documentElement.appendChild(overlay);
  return overlay;
};

const ensureDynamicStyle = (): HTMLStyleElement => {
  const existing = document.getElementById(DYNAMIC_STYLE_ID);
  if (existing) return existing as HTMLStyleElement;

  const style = document.createElement("style");
  style.id = DYNAMIC_STYLE_ID;
  document.documentElement.appendChild(style);
  return style;
};

/** Sets exactly the attributes in the decision on <html>, clearing stale ones */
export const applyBlocks = (decision: BlockDecision) => {
  const html = document.documentElement;

  const desired = new Set(decision.attributes);
  if (decision.overlayMessage !== null) desired.add(ATTRIBUTES.OVERLAY);

  html
    .getAttributeNames()
    .filter((name) => name.startsWith(ATTRIBUTE_PREFIX) && name !== ATTRIBUTES.READY && !desired.has(name))
    .forEach((name) => html.removeAttribute(name));

  desired.forEach((name) => html.setAttribute(name, ""));

  ensureOverlay().textContent = decision.overlayMessage ?? "";
};

/** Releases the anti-flash rules in blocker.css; call once the first decision is applied */
export const markReady = () => {
  document.documentElement.setAttribute(ATTRIBUTES.READY, "");
};

const escapeAttributeValue = (value: string) => value.replace(/["\\]/g, "");

const buildVideoRules = (whitelist: string[]): string => {
  const exemptions = whitelist
    .map((subreddit) => `:not([subreddit-prefixed-name="r/${escapeAttributeValue(subreddit)}" i])`)
    .join("");

  const selectors = VIDEO_POST_SELECTORS.map(
    (selector) => `html[${ATTRIBUTES.HIDE_VIDEOS}] ${selector}${exemptions}`
  );

  return `${selectors.join(",\n")} {\n  display: none !important;\n}`;
};

/** Regenerates the whitelist-aware video rules; call whenever settings change */
export const updateVideoRules = (settings: BlockerSettings) => {
  ensureDynamicStyle().textContent = buildVideoRules(settings.whitelist);
};
