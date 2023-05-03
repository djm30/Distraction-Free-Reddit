export interface RedditSecBlockConfig {
  selector: string; // CSS Selector if applicable
  show: boolean; // Show or hide the section -> true = show, false = hide, will be changed in the url parser
  useBlocker: boolean; // Whether to use the full page blocker or not
  blockMsg: string; // Message to display when the section is blocked
}

export const selectors = {
  mainFeed: "._1OVBBWLtHoSPfGCRaPzpTf",
  sideBar: "._3Kd8DQpBIbsr5E1JcrMFTY",
  comments: "._2M2wOqmeoPVvcSsJ6Po9",
  userFeed: "._31N0dvxfpsO6Ur5AKx4O5d",
  search: "._3Up38k81YNBWQoW1ovMU88",
  all: "._3ozFtOe6WpJEMUtxDOIvtU",
  popular: "._3ozFtOe6WpJEMUtxDOIvtU",
  subFeed: "._3ozFtOe6WpJEMUtxDOIvtU",
  post: "._2DJXORCrmcNpPTSq0LqL6i",
};

// Configuring how all the different sections are to be blocked

const mainFeed: RedditSecBlockConfig = {
  selector: "", // ._1OVBBWLtHoSPfGCRaPzpTf
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const sideBar: RedditSecBlockConfig = {
  selector: "._3Kd8DQpBIbsr5E1JcrMFTY",
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked the main feed",
};

const comments: RedditSecBlockConfig = {
  selector: "._2M2wOqmeoPVvcSsJ6Po9-V",
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const userFeed: RedditSecBlockConfig = {
  selector: "", // ._31N0dvxfpsO6Ur5AKx4O5d
  show: true,
  useBlocker: false,
  blockMsg: "Access to user profiles has been blocked",
};

const search: RedditSecBlockConfig = {
  selector: "._3Up38k81YNBWQoW1ovMU88",
  show: true,
  useBlocker: false,
  blockMsg: "Search Results have been blocked",
};

const subFeed: RedditSecBlockConfig = {
  selector: "", // ._31N0dvxfpsO6Ur5AKx4O5d
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const post: RedditSecBlockConfig = {
  selector: "._2rszc84L136gWQrkwH6IaM",
  show: true,
  useBlocker: false,
  blockMsg: "",
};

const popular: RedditSecBlockConfig = {
  selector: "",
  show: true,
  useBlocker: false,
  blockMsg: "You have blocked access to r/All and r/Popular",
};

export const sections = {
  mainFeed,
  sideBar,
  search,
  popular,
  subFeed,
  userFeed,
  post,
  comments,
};
