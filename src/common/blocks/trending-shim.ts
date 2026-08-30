import { BlockerSettings } from "../settings-config";

/**
 * Trending news suggestions live inside the open shadow root of
 * <reddit-search-large>, which document-level CSS cannot reach. This shim
 * injects a small stylesheet into that shadow root instead.
 *
 * The search element is recreated on every SPA navigation, so the injection is
 * retried briefly after each one.
 */

const STYLE_ID = "dfr-trending-style";
const SEARCH_ELEMENT = "reddit-search-large";
const RETRY_INTERVAL_MS = 50;
const RETRY_TIMEOUT_MS = 2000;

// The header above the list has no stable hook, so it is targeted as
// "the element directly before the trending container".
const TRENDING_CSS = `
#reddit-trending-searches-partial-container,
*:has(+ #reddit-trending-searches-partial-container) {
  display: none !important;
}`;

let blockingEnabled = false;
let retryInterval: ReturnType<typeof setInterval> | undefined;
let retryTimeout: ReturnType<typeof setTimeout> | undefined;

const findSearchShadowRoot = (): ShadowRoot | null =>
  document.querySelector(SEARCH_ELEMENT)?.shadowRoot ?? null;

const injectStyle = (shadowRoot: ShadowRoot) => {
  if (shadowRoot.querySelector(`#${STYLE_ID}`)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = TRENDING_CSS;
  shadowRoot.appendChild(style);
};

const removeStyle = () => {
  findSearchShadowRoot()?.querySelector(`#${STYLE_ID}`)?.remove();
};

const stopRetrying = () => {
  clearInterval(retryInterval);
  clearTimeout(retryTimeout);
};

const injectWithRetry = () => {
  stopRetrying();

  const tryInject = (): boolean => {
    const shadowRoot = findSearchShadowRoot();
    if (!shadowRoot) return false;

    injectStyle(shadowRoot);
    return true;
  };

  if (tryInject()) return;

  retryInterval = setInterval(() => {
    if (tryInject()) stopRetrying();
  }, RETRY_INTERVAL_MS);
  retryTimeout = setTimeout(stopRetrying, RETRY_TIMEOUT_MS);
};

/** Applies the current settings; call on load and whenever settings change */
export const updateTrendingShim = (settings: BlockerSettings) => {
  blockingEnabled = settings.enabled && settings.blocks.trendingNews;

  if (blockingEnabled) {
    injectWithRetry();
  } else {
    stopRetrying();
    removeStyle();
  }
};

/** Re-injects after SPA navigation, since Reddit recreates the search element */
export const reapplyTrendingShim = () => {
  if (blockingEnabled) injectWithRetry();
};
