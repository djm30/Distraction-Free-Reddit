import { RedditSecBlockConfig, BlockSections } from "../../types";

const MAIN_FEED: RedditSecBlockConfig = {
  selector: "", // ._1OVBBWLtHoSPfGCRaPzpTf
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const SIDE_BAR: RedditSecBlockConfig = {
  selector: "._3Kd8DQpBIbsr5E1JcrMFTY",
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const COMMENTS: RedditSecBlockConfig = {
  selector: "._2M2wOqmeoPVvcSsJ6Po9-V",
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const USER_FEED: RedditSecBlockConfig = {
  selector: "", // ._31N0dvxfpsO6Ur5AKx4O5d
  show: true,
  useBlocker: false,
  blockMsg: "Access to user profiles has been blocked",
};

const SEARCH: RedditSecBlockConfig = {
  selector: "._3Up38k81YNBWQoW1ovMU88",
  show: true,
  useBlocker: false,
  blockMsg: "Search Results have been blocked",
};

const SUB_FEED: RedditSecBlockConfig = {
  selector: "", // ._31N0dvxfpsO6Ur5AKx4O5d
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const POST: RedditSecBlockConfig = {
  selector: "._2rszc84L136gWQrkwH6IaM",
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const POPULAR: RedditSecBlockConfig = {
  selector: "",
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked access to r/All and r/Popular",
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
};

export default NEW_SECTIONS;
