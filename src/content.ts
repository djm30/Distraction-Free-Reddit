import { BlockerSettings } from "./common/settings-config";
import storageFunctions from "./common/storage-service";
import { computeBlocks } from "./common/blocks/compute-blocks";
import { applyBlocks, markReady, updateVideoRules } from "./common/blocks/apply-blocks";
import { updateTrendingShim, reapplyTrendingShim } from "./common/blocks/trending-shim";
import { classifyPage, PageType } from "./common/util/url-parser";
import { onUrlChange } from "./common/util/navigation";
import logger from "./common/util/logger";

const OWN_PROFILE_POLL_INTERVAL_MS = 200;
// Polling starts at document_start, before Reddit has rendered anything, so the
// budget has to cover a cold page load rather than just a slow render.
const OWN_PROFILE_TIMEOUT_MS = 10000;

let settings: BlockerSettings;
let isOwnProfile: boolean | undefined;
/** Bumped on every navigation so an in-flight lookup can tell it has been superseded */
let navigationId = 0;

const refresh = () => {
  applyBlocks(computeBlocks(document.URL, settings, { isOwnProfile }));
  updateVideoRules(settings);
  updateTrendingShim(settings);
};

/**
 * Reddit tags every profile page with the viewer's relationship to it:
 * {"profile":{"name":"someone","context":"owner"|"visitor"}}. The name is
 * checked against the url so a stale element left behind by the previous soft
 * navigation is ignored rather than trusted.
 *
 * Returns null while the answer is not yet knowable.
 */
const readProfileOwnership = (urlUsername: string): boolean | null => {
  const data = document.querySelector("shreddit-screenview-data")?.getAttribute("data");
  if (!data) return null;

  let profile: { name?: string; context?: string } | undefined;
  try {
    profile = JSON.parse(data).profile;
  } catch {
    return null;
  }

  if (profile?.name?.toLowerCase() !== urlUsername.toLowerCase()) return null;
  return profile.context === "owner";
};

/**
 * Profile pages start blocked; the block is lifted only once Reddit confirms
 * the page belongs to the logged-in user.
 */
const resolveOwnProfile = (urlUsername: string) => {
  const requestId = navigationId;

  const check = (): boolean => {
    const owned = readProfileOwnership(urlUsername);
    if (owned === null) return false;

    isOwnProfile = owned;
    if (isOwnProfile) refresh();
    return true;
  };

  if (check()) return;

  const poll = setInterval(() => {
    // Stop early if a later navigation has taken over
    if (requestId !== navigationId || check()) clearInterval(poll);
  }, OWN_PROFILE_POLL_INTERVAL_MS);

  setTimeout(() => clearInterval(poll), OWN_PROFILE_TIMEOUT_MS);
};

const handleUrl = (url: string) => {
  navigationId += 1;
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
