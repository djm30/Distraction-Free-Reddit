import { RedditSecBlockConfig, sections } from "./block-section-config";
import { BlockMode, BlockerSettings } from "./settings-config";

// Each of these methods returns an array of BlockSections for a certain page

// Gets classes based on current homepage settings
const getHomepageBlocks = (settings: BlockerSettings) => {
  // Loading up default section configs, which will be turned off by default. They will be turned on if the users settings allow it
  const mainFeedSection: RedditSecBlockConfig = { ...sections.mainFeed };
  const sideBarSection: RedditSecBlockConfig = { ...sections.sideBar };
  if (settings.blocks.mainFeed) {
    // Configuring main feed section
    mainFeedSection.show = false;
    mainFeedSection.useBlocker = true;

    // Configuring sidebar section
    sideBarSection.useBlocker = true;
  }
  if (settings.blocks.sidebar) {
    sideBarSection.show = false;
  }

  return [mainFeedSection, sideBarSection];
};

const getSearchPageBlocks = (settings: BlockerSettings) => {
  const searchFeedSection: RedditSecBlockConfig = { ...sections.search };
  if (settings.blocks.search) {
    searchFeedSection.show = false;
    searchFeedSection.useBlocker = true;
  }
  return [searchFeedSection];
};

const getAllPopularBlocks = (settings: BlockerSettings) => {
  const allSection: RedditSecBlockConfig = { ...sections.popular };
  if (settings.blocks.all) {
    allSection.show = false;
    allSection.useBlocker = true;
  }
  return [allSection];
};

const getSubredditBlocks = (settings: BlockerSettings, subreddit: string) => {
  const subFeedSection: RedditSecBlockConfig = { ...sections.subFeed };
  if (settings.mode === BlockMode.BLACKLIST) {
    if (settings.blacklist.includes(subreddit.toLowerCase())) {
      subFeedSection.show = false;
      subFeedSection.useBlocker = true;
      subFeedSection.blockMsg = `r/${subreddit} is on your blacklist`;
    }
  } else if (settings.mode === BlockMode.WHITELIST) {
    if (!settings.whitelist.includes(subreddit.toLowerCase())) {
      subFeedSection.show = false;
      subFeedSection.useBlocker = true;
      subFeedSection.blockMsg = `r/${subreddit} is not on your whitelist`;
    }
  }
  return [subFeedSection];
};

const getUserProfileBlocks = (settings: BlockerSettings) => {
  const userFeedSection: RedditSecBlockConfig = { ...sections.userFeed };
  if (settings.blocks.userFeed) {
    userFeedSection.show = false;
    userFeedSection.useBlocker = true;
  }
  return [userFeedSection];
};

const getPostBlocks = (settings: BlockerSettings, subreddit: string) => {
  const postSettings: RedditSecBlockConfig = { ...sections.post };
  subreddit = subreddit.toLowerCase();

  if (settings.mode === BlockMode.BLACKLIST) {
    if (settings.blacklist.includes(subreddit)) {
      postSettings.show = false;
    }
  } else if (settings.mode === BlockMode.WHITELIST) {
    if (!settings.whitelist.includes(subreddit)) {
      postSettings.show = false;
    }
  }
  const commentSettings: RedditSecBlockConfig = { ...sections.comments };
  if (settings.blocks.comments) {
    commentSettings.show = false;
  }

  return [postSettings, commentSettings];
};

export default {
  getHomepageBlocks,
  getSearchPageBlocks,
  getAllPopularBlocks,
  getSubredditBlocks,
  getUserProfileBlocks,
  getPostBlocks,
};
