import { BlockerSettings } from "../settings-config";
import BlockFinder from "./get-blocks";
import { RedditSecBlockConfig, BlockSections } from "../types";

const BASE_URL_PATTERN = /^https?:\/\/(www|new|old)\.reddit\.com/;

export const REGEXES = {
  HOMEPAGE: new RegExp(`${BASE_URL_PATTERN.source}/(best|hot|new|top/.*|\\?feed=[a-zA-Z0-9_/]*)?/?$`),
  SEARCH_PAGE: new RegExp(`${BASE_URL_PATTERN.source}/search/?\\?q=.*`),
  ALL_POPULAR: new RegExp(`${BASE_URL_PATTERN.source}/r/(all|popular)/.*$`),
  USER_PROFILE: new RegExp(`${BASE_URL_PATTERN.source}/user/([^/]*)/?(.*)`),
  SUBREDDIT: new RegExp(`${BASE_URL_PATTERN.source}/r/([^/]+)*/$`),
  POST: new RegExp(`${BASE_URL_PATTERN.source}/r/(.*)/comments/.*`),
};

// Finds out the current page and returns the sections that need to be blocked according to the set settings
export const parseUrl = (
  url: string,
  settings: BlockerSettings,
  sections: BlockSections,
  isUserProfile?: (username: string) => boolean,
): RedditSecBlockConfig[] => {
  // What sections of the webpage need blocked?
  let blockedSections: RedditSecBlockConfig[] = [];
  if (!settings.enabled) return blockedSections;
  switch (true) {
    case REGEXES.HOMEPAGE.test(url):
      blockedSections.push(...BlockFinder.getHomepageBlocks(settings, sections));
      break;

    case REGEXES.SEARCH_PAGE.test(url):
      blockedSections.push(...BlockFinder.getSearchPageBlocks(settings, sections));
      break;

    case REGEXES.ALL_POPULAR.test(url):
      blockedSections.push(...BlockFinder.getAllPopularBlocks(settings, sections));
      break;

    case REGEXES.USER_PROFILE.test(url):
      const urlUsername = url.match(REGEXES.USER_PROFILE)?.[2] as string;
      if (isUserProfile && !isUserProfile(urlUsername)) {
        blockedSections.push(...BlockFinder.getUserProfileBlocks(settings, sections));
      } else {
        // This will hide the blocker when navigating to the users profile
        blockedSections.push({ show: true, useBlocker: false, selectors: [], blockMsg: "" });
      }
      break;

    case REGEXES.SUBREDDIT.test(url):
      let subreddit = url.match(REGEXES.SUBREDDIT)?.[2];
      blockedSections.push(...BlockFinder.getSubredditBlocks(settings, subreddit as string, sections));
      break;

    case REGEXES.POST.test(url):
      subreddit = url.match(REGEXES.POST)?.[2];
      blockedSections.push(...BlockFinder.getPostBlocks(settings, subreddit as string, sections));
      break;

    default:
      break;
  }

  return blockedSections;
};
