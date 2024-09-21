import { RedditSecBlockConfig, BlockSections } from "../../types";

const MAIN_FEED: RedditSecBlockConfig = {
  selectors: ["._1OVBBWLtHoSPfGCRaPzpTf "], // ._1OVBBWLtHoSPfGCRaPzpTf
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const SIDE_BAR: RedditSecBlockConfig = {
  selectors: ["._3Kd8DQpBIbsr5E1JcrMFTY"],
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const COMMENTS: RedditSecBlockConfig = {
  selectors: ["_1r4smTyOEZFO91uFIdWW6T", "._1ump7uMrSA43cqok14tPrG"],
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const USER_FEED: RedditSecBlockConfig = {
  selectors: ["._31N0dvxfpsO6Ur5AKx4O5d", "._31N0dvxfpsO6Ur5AKx4O5d"], // ._31N0dvxfpsO6Ur5AKx4O5d
  show: true,
  useBlocker: false,
  blockMsg: "Access to user profiles has been blocked",
};

const SEARCH: RedditSecBlockConfig = {
  selectors: ["._3Up38k81YNBWQoW1ovMU88"],
  show: true,
  useBlocker: false,
  blockMsg: "Search Results have been blocked",
};

const SUB_FEED: RedditSecBlockConfig = {
  selectors: ["._1OVBBWLtHoSPfGCRaPzpTf "], // ._31N0dvxfpsO6Ur5AKx4O5d
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const POST: RedditSecBlockConfig = {
  selectors: ["._31N0dvxfpsO6Ur5AKx4O5d", ".uI_hDmU5GSiudtABRz_37"],
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const POPULAR: RedditSecBlockConfig = {
  selectors: ["._1OVBBWLtHoSPfGCRaPzpTf", "#TrendingPostsContainer"],
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked access to r/All and r/Popular",
};

const REDDIT_LOGO: RedditSecBlockConfig = {
  selectors: [""],
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const NEW_SECTIONS: BlockSections = {
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

export default NEW_SECTIONS;
