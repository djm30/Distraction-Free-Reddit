import { BlockMode, BlockerSettings } from "../settings-config";
import { BlockSections, RedditSecBlockConfig } from "../types";

// Each of these methods returns an array of BlockSections for a certain page

// Gets classes based on current homepage settings
const homepageBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  // Loading up default section configs, which will be turned off by default. They will be turned on if the users settings allow it
  const mainFeedSection: RedditSecBlockConfig = { ...sections.MAIN_FEED };
  const sideBarSection: RedditSecBlockConfig = { ...sections.SIDE_BAR };
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
  sections: BlockSections,
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

const redditLogoBlocks = (settings: BlockerSettings, sections: BlockSections): RedditSecBlockConfig[] => {
  const redditLogoBlock: RedditSecBlockConfig = { ...sections.REDDIT_LOGO };
  if (settings.blocks.redditLogo) {
    redditLogoBlock.show = false;
  }
  return [redditLogoBlock];
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
  searchPageBlocks,
  allPopularBlocks,
  subredditBlocks,
  userProfileBlocks,
  postBlocks,
  redditLogoBlocks,
  sideBarBlocks,
};

export default blockSections;
