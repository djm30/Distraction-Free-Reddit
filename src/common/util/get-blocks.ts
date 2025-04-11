import { BlockMode, BlockerSettings } from "../settings-config";
import { BlockSections, RedditSecBlockConfig } from "../types";

// Each of these methods returns an array of BlockSections for a certain page

// Gets classes based on current homepage settings
const homepageBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  // Loading up default section configs, which will be turned off by default. They will be turned on if the users settings allow it
  const mainFeedSection: RedditSecBlockConfig = { ...sections.MAIN_FEED };
  const sideBarSection: RedditSecBlockConfig = { ...sections.SIDE_BAR };
  const notificationsSection: RedditSecBlockConfig = { ...sections.NOTIFICATIONS };

  if (settings.blocks.mainFeed) {
    mainFeedSection.show = false;
    mainFeedSection.useBlocker = true;
  }

  // Don't need to use full page block for either on the main page
  sideBarSection.useBlocker = false;
  sideBarSection.show = !settings.blocks.sidebar;

  notificationsSection.useBlocker = false;
  notificationsSection.show = !settings.blocks.notifications;

  return [mainFeedSection, sideBarSection, notificationsSection];
};

// For elements that always appear on every page, i.e nav bar elements
const alwaysVisibleBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const notificationsSection: RedditSecBlockConfig = { ...sections.NOTIFICATIONS };
  const redditLogoBlock: RedditSecBlockConfig = { ...sections.REDDIT_LOGO };
  const alwaysVisibleBlocks: RedditSecBlockConfig = { ...sections.ALWAYS_BLOCK };

  redditLogoBlock.show = !settings.blocks.redditLogo;

  if (settings.blocks.notifications) {
    notificationsSection.show = false;
    notificationsSection.useBlocker = false;
  }

  return [alwaysVisibleBlocks, notificationsSection, redditLogoBlock];
};

const notificationsBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const notificationsSection: RedditSecBlockConfig = { ...sections.NOTIFICATIONS };

  if (settings.blocks.notifications) {
    notificationsSection.show = false;
    notificationsSection.useBlocker = true;
  }

  return [notificationsSection];
};

const searchPageBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const searchFeedSection: RedditSecBlockConfig = { ...sections.SEARCH };

  if (settings.blocks.search) {
    searchFeedSection.show = false;
    searchFeedSection.useBlocker = true;
  }

  return [searchFeedSection];
};

const allPopularBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const allSection: RedditSecBlockConfig = { ...sections.POPULAR };
  if (settings.blocks.all) {
    allSection.show = false;
    allSection.useBlocker = true;
  }
  return [allSection];
};

const subredditBlocks = (
  settings: BlockerSettings,
  subreddit: string,
  sections: BlockSections
): RedditSecBlockConfig[] => {
  const subFeedSection: RedditSecBlockConfig = { ...sections.SUB_FEED };
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

  if (settings.blocks.subFeed) {
    subFeedSection.show = false;
    subFeedSection.useBlocker = true;
    subFeedSection.blockMsg = "You have blocked access to Subreddit feeds";
  }

  return [subFeedSection];
};

const userProfileBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const userFeedSection: RedditSecBlockConfig = { ...sections.USER_FEED };
  if (settings.blocks.userFeed) {
    userFeedSection.show = false;
    userFeedSection.useBlocker = true;
  }
  return [userFeedSection];
};

const postBlocks = (settings: BlockerSettings, subreddit: string, sections: BlockSections): RedditSecBlockConfig[] => {
  const postSettings: RedditSecBlockConfig = { ...sections.POST };
  subreddit = subreddit.toLowerCase();

  if (settings.mode === BlockMode.BLACKLIST) {
    if (settings.blacklist.includes(subreddit)) {
      postSettings.show = false;
      postSettings.blockMsg = `r/${subreddit} is not on your blacklist`;
    }
  } else if (settings.mode === BlockMode.WHITELIST) {
    if (!settings.whitelist.includes(subreddit)) {
      postSettings.show = false;
      postSettings.blockMsg = `r/${subreddit} is not on your whitelist`;
    }
  }
  const commentSettings: RedditSecBlockConfig = { ...sections.COMMENTS };
  if (settings.blocks.comments) {
    commentSettings.show = false;
  }

  const sideBarSettings: RedditSecBlockConfig = { ...sections.SIDE_BAR };
  if (!postSettings.show) {
    sideBarSettings.show = false;
  }
  return [postSettings, commentSettings, sideBarSettings];
};

const sideBarBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const sideBarSection = { ...sections.SIDE_BAR };
  if (settings.blocks.sidebar) {
    sideBarSection.show = false;
  }
  return [sideBarSection];
};

const blockSections = {
  homepageBlocks,
  notificationsBlocks,
  searchPageBlocks,
  allPopularBlocks,
  subredditBlocks,
  userProfileBlocks,
  postBlocks,
  sideBarBlocks,
  alwaysVisibleBlocks,
};

export default blockSections;
