import { BlockerSettings } from "./settings-config";

export interface Blocker {
  block: (url: string, settings: BlockerSettings) => void;
  onload: (url: string, settings: BlockerSettings) => void;
}

export interface Regexes {
  HOMEPAGE: string;
  SEARCH_PAGE: string;
  ALL_POPULAR: string;
  USER_PROFILE: string;
  SUBREDDIT: string;
  POST: string;
}

export interface RedditSecBlockConfig {
  selector: string; // CSS Selector if applicable
  show: boolean; // Show or hide the section -> true = show, false = hide, will be changed in the url parser
  useBlocker: boolean; // Whether to use the full page blocker or not
  blockMsg: string; // Message to display when the section is blocked
}

export interface BlockSections {
  MAIN_FEED: RedditSecBlockConfig;
  SIDE_BAR: RedditSecBlockConfig;
  COMMENTS: RedditSecBlockConfig;
  USER_FEED: RedditSecBlockConfig;
  SEARCH: RedditSecBlockConfig;
  SUB_FEED: RedditSecBlockConfig;
  POST: RedditSecBlockConfig;
  POPULAR: RedditSecBlockConfig;
}
