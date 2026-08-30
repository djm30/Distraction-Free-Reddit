import { BlockerSettings } from "./common/settings-config";
import storageFunctions from "./common/storage-service";
import { computeBlocks } from "./common/blocks/compute-blocks";
import { applyBlocks, markReady, updateVideoRules } from "./common/blocks/apply-blocks";
import { updateTrendingShim, reapplyTrendingShim } from "./common/blocks/trending-shim";
import { classifyPage, PageType } from "./common/util/url-parser";
import { onUrlChange } from "./common/util/navigation";
import logger from "./common/util/logger";

const OWN_PROFILE_RETRY_INTERVAL_MS = 200;
const OWN_PROFILE_RETRY_TIMEOUT_MS = 3000;

let settings: BlockerSettings;
let isOwnProfile: boolean | undefined;

const refresh = () => {
  applyBlocks(computeBlocks(document.URL, settings, { isOwnProfile }));
  updateVideoRules(settings);
  updateTrendingShim(settings);
};

const findLoggedInUsername = (): string | null => {
  const profileLink = document.querySelector<HTMLAnchorElement>("faceplate-tracker[noun=profile] a");
  if (!profileLink) return null;

  const segments = profileLink.href.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? null;
};

/**
 * Profile pages start blocked; once the DOM reveals who is logged in, the
 * block is lifted if the profile belongs to the user. The logged-in indicator
 * renders asynchronously, hence the brief retry loop.
 */
const resolveOwnProfile = (urlUsername: string) => {
  const check = (): boolean => {
    const loggedInUsername = findLoggedInUsername();
    if (loggedInUsername === null) return false;

    isOwnProfile = loggedInUsername === urlUsername;
    if (isOwnProfile) refresh();
    return true;
  };

  if (check()) return;

  const retryInterval = setInterval(() => {
    if (check()) clearInterval(retryInterval);
  }, OWN_PROFILE_RETRY_INTERVAL_MS);
  setTimeout(() => clearInterval(retryInterval), OWN_PROFILE_RETRY_TIMEOUT_MS);
};

const handleUrl = (url: string) => {
  isOwnProfile = undefined;
  refresh();
  reapplyTrendingShim();

  const page = classifyPage(url);
  if (page.type === PageType.USER_PROFILE && page.username) {
    resolveOwnProfile(page.username);
  }
};

const main = (initialSettings: BlockerSettings) => {
  settings = initialSettings;

  handleUrl(document.URL);
  markReady();

  onUrlChange(handleUrl);
  storageFunctions.onSettingsChanged((updatedSettings) => {
    logger.info("Settings updated");
    settings = updatedSettings;
    refresh();
  });

  logger.info("Content script loaded");
};

// Old reddit is unsupported: release the anti-flash CSS and do nothing else
if (location.hostname.startsWith("old.")) {
  markReady();
} else {
  storageFunctions
    .getSettings()
    .then(main)
    .catch((error) => {
      logger.error(error);
      // Never leave the page hidden by the anti-flash rules
      markReady();
    });
}
