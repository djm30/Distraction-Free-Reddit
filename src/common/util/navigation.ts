/**
 * SPA navigation detection without observing Reddit's (very busy) DOM.
 *
 * Chrome: the Navigation API fires for every soft navigation, and its events
 * are visible from the content script's isolated world.
 *
 * Firefox (no Navigation API): popstate covers back/forward, and a tiny
 * observer on <title> — which Reddit updates on every navigation — covers
 * pushState. History monkey-patching is not an option from an isolated world.
 */

type UrlChangeCallback = (url: string) => void;

export const onUrlChange = (callback: UrlChangeCallback) => {
  let currentUrl = document.URL;

  const notifyIfChanged = () => {
    if (document.URL === currentUrl) return;
    currentUrl = document.URL;
    callback(currentUrl);
  };

  const navigation = (window as any).navigation;
  if (navigation?.addEventListener) {
    navigation.addEventListener("navigatesuccess", notifyIfChanged);
    return;
  }

  window.addEventListener("popstate", notifyIfChanged);

  const observeTitle = () => {
    const title = document.querySelector("title");
    if (!title) return;
    new MutationObserver(notifyIfChanged).observe(title, { childList: true });
  };

  // At document_start <title> doesn't exist yet, and no SPA navigation can
  // happen before the document has parsed anyway.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeTitle);
  } else {
    observeTitle();
  }
};
