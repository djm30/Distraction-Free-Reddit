import { SpecializedBlocker } from "../../types";
import { BlockerSettings } from "../../settings-config";

let localSettings: BlockerSettings;

const RETRY_INTERVAL_MS = 25;
const MAX_RETRY_DURATION_MS = 500;

const setupSearchInputListeners = (searchInput: HTMLInputElement) => {
  let retryInterval: ReturnType<typeof setInterval>;
  let retryTimeout: ReturnType<typeof setTimeout>;

  const removeNewsWithRetry = () => {
    removeTrendingNews();
    clearTimeout(retryTimeout);
    clearInterval(retryInterval);
    retryInterval = startRetryingToRemoveNews();
    retryTimeout = stopRetryingAfterTimeout(retryInterval);
  };

  searchInput.addEventListener("focus", removeNewsWithRetry);
  searchInput.addEventListener("input", removeNewsWithRetry);
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
  const newsResultsContainer = getNewsResultsContainer();

  trendingNewsList?.remove();
  trendingNewsHeader?.remove();
  newsResultsContainer?.classList.remove("border-solid");
  newsResultsContainer?.parentElement?.classList.remove("border-solid");
};

const getSearchInput = (): HTMLInputElement => {
  return searchElementParent()
    ?.querySelector("faceplate-search-input")
    ?.shadowRoot?.querySelector("input") as HTMLInputElement;
};

const getTrendingNewsList = (): HTMLUListElement =>
  searchElementParent()?.querySelector("#reddit-trending-searches-partial-container") as HTMLUListElement;

const getTrendingNewsHeader = () => getTrendingNewsList()?.previousElementSibling;

const getNewsResultsContainer = () => searchElementParent()?.querySelector("#reddit-recent-searches-partial-container");

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

const TrendingNews: SpecializedBlocker = {
  initialise: initialiseTrendingNewsBlocker,
  block: blockTrendingNews,
};

export default TrendingNews;
