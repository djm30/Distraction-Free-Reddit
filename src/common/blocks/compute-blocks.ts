import { BlockMode, BlockerSettings } from "../settings-config";
import { classifyPage, PageType } from "../util/url-parser";

/**
 * Attributes set on <html> that activate the matching rules in styles/blocker.css.
 * Trending news has no attribute: it lives inside a shadow root that document-level
 * CSS cannot reach, so it is handled by the trending shim instead.
 */
export const ATTRIBUTES = {
  READY: "data-dfr-ready",
  OVERLAY: "data-dfr-overlay",
  HIDE_MAIN_FEED: "data-dfr-hide-mainfeed",
  HIDE_SIDEBAR: "data-dfr-hide-sidebar",
  HIDE_COMMENTS: "data-dfr-hide-comments",
  HIDE_NOTIFICATIONS: "data-dfr-hide-notifications",
  HIDE_SEARCH: "data-dfr-hide-search",
  HIDE_SUB_FEED: "data-dfr-hide-subfeed",
  HIDE_POST: "data-dfr-hide-post",
  HIDE_POPULAR: "data-dfr-hide-popular",
  HIDE_EXPLORE: "data-dfr-hide-explore",
  HIDE_USER_FEED: "data-dfr-hide-userfeed",
  HIDE_LOGO: "data-dfr-hide-logo",
  HIDE_ADS: "data-dfr-hide-ads",
  HIDE_VIDEOS: "data-dfr-hide-videos",
} as const;

export const MESSAGES = {
  MAIN_FEED: "You have blocked the main feed",
  NOTIFICATIONS: "You have blocked access to notifications",
  SEARCH: "Search Results have been blocked",
  ALL_POPULAR: "You have blocked access to r/All and r/Popular",
  EXPLORE: "You have blocked access to the Explore page",
  SUB_FEED: "You have blocked access to Subreddit feeds",
  USER_PROFILES: "Access to user profiles has been blocked",
  blacklisted: (subreddit: string) => `r/${subreddit} is on your blacklist`,
  notWhitelisted: (subreddit: string) => `r/${subreddit} is not on your whitelist`,
};

export interface BlockDecision {
  /** data-dfr-* attributes to set on <html> */
  attributes: string[];
  /** When non-null, the full page overlay is shown with this message */
  overlayMessage: string | null;
}

export interface PageContext {
  /**
   * Whether the profile page being viewed belongs to the logged-in user.
   * Resolved from the DOM after load; undefined means "assume it doesn't".
   */
  isOwnProfile?: boolean;
}

const NO_BLOCKS: BlockDecision = { attributes: [], overlayMessage: null };

const includesIgnoreCase = (list: string[], value: string) =>
  list.some((entry) => entry.toLowerCase() === value.toLowerCase());

/** Returns the overlay message for a list-blocked subreddit, or null if the subreddit is allowed */
const subredditListBlockMessage = (settings: BlockerSettings, subreddit: string): string | null => {
  if (settings.mode === BlockMode.BLACKLIST && includesIgnoreCase(settings.blacklist, subreddit)) {
    return MESSAGES.blacklisted(subreddit);
  }
  if (settings.mode === BlockMode.WHITELIST && !includesIgnoreCase(settings.whitelist, subreddit)) {
    return MESSAGES.notWhitelisted(subreddit);
  }
  return null;
};

/**
 * The single decision point of the extension: translates the current URL and the
 * user's settings into the set of html attributes (and optional full-page overlay)
 * that the static stylesheet acts upon.
 */
export const computeBlocks = (
  url: string,
  settings: BlockerSettings,
  context: PageContext = {}
): BlockDecision => {
  if (!settings.enabled) return NO_BLOCKS;

  const attributes = new Set<string>([ATTRIBUTES.HIDE_ADS]);
  let overlayMessage: string | null = null;

  const blockFullPage = (attribute: string, message: string) => {
    attributes.add(attribute);
    overlayMessage = message;
  };

  // Blocks that apply on every page
  if (settings.blocks.sidebar) attributes.add(ATTRIBUTES.HIDE_SIDEBAR);
  if (settings.blocks.notifications) attributes.add(ATTRIBUTES.HIDE_NOTIFICATIONS);
  if (settings.blocks.redditLogo) attributes.add(ATTRIBUTES.HIDE_LOGO);
  if (settings.blocks.videos) attributes.add(ATTRIBUTES.HIDE_VIDEOS);

  const page = classifyPage(url);

  switch (page.type) {
    case PageType.HOMEPAGE:
      if (settings.blocks.mainFeed) blockFullPage(ATTRIBUTES.HIDE_MAIN_FEED, MESSAGES.MAIN_FEED);
      break;

    case PageType.NOTIFICATIONS:
      if (settings.blocks.notifications) overlayMessage = MESSAGES.NOTIFICATIONS;
      break;

    case PageType.SEARCH:
      if (settings.blocks.search) blockFullPage(ATTRIBUTES.HIDE_SEARCH, MESSAGES.SEARCH);
      break;

    case PageType.ALL_POPULAR:
      if (settings.blocks.all) blockFullPage(ATTRIBUTES.HIDE_POPULAR, MESSAGES.ALL_POPULAR);
      break;

    case PageType.EXPLORE:
      if (settings.blocks.explore) blockFullPage(ATTRIBUTES.HIDE_EXPLORE, MESSAGES.EXPLORE);
      break;

    case PageType.USER_PROFILE:
      if (settings.blocks.userFeed && !context.isOwnProfile) {
        blockFullPage(ATTRIBUTES.HIDE_USER_FEED, MESSAGES.USER_PROFILES);
      }
      break;

    case PageType.SUBREDDIT: {
      const listMessage = subredditListBlockMessage(settings, page.subreddit as string);
      if (listMessage) blockFullPage(ATTRIBUTES.HIDE_SUB_FEED, listMessage);
      // A blanket sub-feed block takes precedence over list-based messages
      if (settings.blocks.subFeed) blockFullPage(ATTRIBUTES.HIDE_SUB_FEED, MESSAGES.SUB_FEED);
      break;
    }

    case PageType.POST: {
      const listMessage = subredditListBlockMessage(settings, page.subreddit as string);
      if (listMessage) {
        blockFullPage(ATTRIBUTES.HIDE_POST, listMessage);
        attributes.add(ATTRIBUTES.HIDE_SIDEBAR);
      }
      if (settings.blocks.comments) attributes.add(ATTRIBUTES.HIDE_COMMENTS);
      break;
    }
  }

  return { attributes: [...attributes], overlayMessage };
};
