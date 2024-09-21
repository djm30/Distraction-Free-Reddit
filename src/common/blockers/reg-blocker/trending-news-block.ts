import { CustomBlock } from "../../types";
import { BlockerSettings } from "../../settings-config";

let localSettings: BlockerSettings;

const RETRY_INTERVAL_MS = 50;
const MAX_RETRY_DURATION_MS = 500;

const setupSearchInputListeners = (searchInput: HTMLInputElement) => {
  let retryInterval: ReturnType<typeof setInterval>;
  let retryTimeout: ReturnType<typeof setTimeout>;

  searchInput.addEventListener("focus", () => {
    retryInterval = startRetryingToRemoveNews();
    retryTimeout = stopRetryingAfterTimeout(retryInterval);
  });

  searchInput.addEventListener("change", () => {
    clearTimeout(retryTimeout);
    clearInterval(retryInterval);
    removeTrendingNews();
  });
};

const startRetryingToRemoveNews = () => setInterval(removeTrendingNews, RETRY_INTERVAL_MS);

const stopRetryingAfterTimeout = (retryInterval: ReturnType<typeof setInterval>) => {
  return setTimeout(() => {
    clearInterval(retryInterval);
  }, MAX_RETRY_DURATION_MS);
};

const removeTrendingNews = () => {
  if (!localSettings.blocks.trendingNews) return;

  const trendingNewsList = getTrendingNewsList();
  const trendingNewsHeader = getTrendingNewsHeader();
  const searchResultsContainer = getSearchResultsContainer();

  trendingNewsList?.remove();
  trendingNewsHeader?.remove();
  searchResultsContainer?.classList.remove("border-solid");
};

const getSearchInput = (): HTMLInputElement | null => {
  return searchElementParent()
    ?.querySelector("faceplate-search-input")
    ?.shadowRoot?.querySelector("input") as HTMLInputElement | null;
};

const getTrendingNewsList = () => searchElementParent()?.querySelector("#reddit-trending-searches-partial-container");

const getTrendingNewsHeader = () => getTrendingNewsList()?.previousElementSibling;

const getSearchResultsContainer = () =>
  searchElementParent()?.querySelector("#reddit-recent-searches-partial-container");

const searchElementParent = () => document.querySelector("reddit-search-large")?.shadowRoot;

// Creating CustomBlocker functions
const initialiseTrendingNewsBlocker = (settings: BlockerSettings) => {
  localSettings = settings;

  const searchInput = getSearchInput();
  if (!searchInput) return;

  setupSearchInputListeners(searchInput);
};

const blockTrendingNews = (settings: BlockerSettings) => {
  localSettings = settings;
};

const TrendingNews: CustomBlock = {
  initialise: initialiseTrendingNewsBlocker,
  block: blockTrendingNews,
};

export default TrendingNews;
