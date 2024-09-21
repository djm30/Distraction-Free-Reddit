import { RedditSecBlockConfig, BlockSections } from "../../types";

const MAIN_FEED: RedditSecBlockConfig = {
  selectors: [".main-container", "shreddit-feed", "#home-posts"], // ._1OVBBWLtHoSPfGCRaPzpTf
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const SIDE_BAR: RedditSecBlockConfig = {
  selectors: ["#left-sidebar-container", "#hamburger-button-tooltip", "recent-posts", "#right-sidebar-container"],
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const COMMENTS: RedditSecBlockConfig = {
  selectors: ["comment-body-header", "#comment-tree"],
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const USER_FEED: RedditSecBlockConfig = {
  selectors: [""],
  show: true,
  useBlocker: false,
  blockMsg: "Access to user profiles has been blocked",
};

const SEARCH: RedditSecBlockConfig = {
  selectors: [".masthead", ".main-container"],
  show: true,
  useBlocker: true,
  blockMsg: "Search Results have been blocked",
};

const SUB_FEED: RedditSecBlockConfig = {
  selectors: ["#main-content", "#right-sidebar-container"],
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const POST: RedditSecBlockConfig = {
  selectors: ["shreddit-post", "#right-sidebar-container"],
  show: true,
  useBlocker: true,
  blockMsg: "",
};

const POPULAR: RedditSecBlockConfig = {
  selectors: [".main-container", "shreddit-feed", "#popular-posts", "#all-posts"],
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked access to r/All and r/Popular",
};

const REDDIT_LOGO: RedditSecBlockConfig = {
  selectors: ["#reddit-logo"],
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const REG_SECTIONS: BlockSections = {
  MAIN_FEED,
  SIDE_BAR,
  COMMENTS,
  USER_FEED,
  SEARCH,
  SUB_FEED,
  POST,
  POPULAR,
  REDDIT_LOGO,
};

export default REG_SECTIONS;
