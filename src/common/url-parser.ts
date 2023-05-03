import { BlockMode, BlockerSettings } from "./settings-config";
import { RedditSecBlockConfig, sections } from "./block-section-config";
import BlockFinder from "./get-blocks";

const REGEXES = {
  HOMEPAGE: /^https:\/\/www.reddit.com\/(best\/|hot\/|new\/|top\/.*)*$/,
  SEARCH_PAGE: /^https:\/\/www.reddit.com\/search\/\?q=.*/,
  ALL_POPULAR: /^https:\/\/www.reddit.com\/r\/(all|popular)\/.*$/,
  USER_PROFILE: /^https:\/\/www.reddit.com\/user\/([^\/]*)\/?(.*)/,
  SUBREDDIT: /^https:\/\/www.reddit.com\/r\/([^\/]+)*\/$/,
  POST: /^https:\/\/www.reddit.com\/r\/(.*)\/comments\/.*/,
};

// Finds out the current page and returns the sections that need to be blocked according to the set settings
export const parseUrl = (url: string, settings: BlockerSettings): RedditSecBlockConfig[] => {
  // What sections of the webpage need blocked?
  let sections: RedditSecBlockConfig[] = [];
  if (!settings.enabled) return sections;
  switch (true) {
    case REGEXES.HOMEPAGE.test(url):
      sections.push(...BlockFinder.getHomepageBlocks(settings));
      break;

    case REGEXES.SEARCH_PAGE.test(url):
      sections.push(...BlockFinder.getSearchPageBlocks(settings));
      break;

    case REGEXES.ALL_POPULAR.test(url):
      sections.push(...BlockFinder.getAllPopularBlocks(settings));
      break;

    case REGEXES.USER_PROFILE.test(url):
      console.log("On user profile page");
      sections.push(...BlockFinder.getUserProfileBlocks(settings));
      break;

    case REGEXES.SUBREDDIT.test(url):
      let subreddit = url.match(REGEXES.SUBREDDIT)?.[1];
      sections.push(...BlockFinder.getSubredditBlocks(settings, subreddit as string));
      break;

    case REGEXES.POST.test(url):
      subreddit = url.match(REGEXES.POST)?.[1];
      sections.push(...BlockFinder.getPostBlocks(settings, subreddit as string));
      break;

    default:
      break;
  }

  return sections;
};
