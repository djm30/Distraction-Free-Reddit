import { BlockTypes, BlockMode } from "./settings-config";
import storageFunctions from "../chrome/storage";

// Need to somehow change this with build script, but allows for native apis to be abstracted behind a single interface

export default storageFunctions;

export const setMode = async (mode: BlockMode) => {
  const settings = await storageFunctions.getSettings();
  settings.mode = mode;
  await storageFunctions.setSettings(settings);
};

export const pushBlacklist = async (subreddit: string) => {
  const settings = await storageFunctions.getSettings();
  settings.blacklist.push(subreddit);
  await storageFunctions.setSettings(settings);
};

export const removeBlacklist = async (subreddit: string) => {
  const settings = await storageFunctions.getSettings();
  settings.blacklist = settings.blacklist.filter((sub) => sub !== subreddit);
  await storageFunctions.setSettings(settings);
};

export const pushWhitelist = async (subreddit: string) => {
  const settings = await storageFunctions.getSettings();
  settings.whitelist.push(subreddit);
  await storageFunctions.setSettings(settings);
};

export const removeWhitelist = async (subreddit: string) => {
  const settings = await storageFunctions.getSettings();
  settings.whitelist = settings.whitelist.filter((sub) => sub !== subreddit);
  await storageFunctions.setSettings(settings);
};

export const toggleEnabled = async () => {
  const settings = await storageFunctions.getSettings();
  settings.enabled = !settings.enabled;
  await storageFunctions.setSettings(settings);
};

export const toggleOption = async (option: BlockTypes) => {
  const settings = await storageFunctions.getSettings();
  switch (option) {
    case BlockTypes.ALL:
      settings.blocks.all = !settings.blocks.all;
      break;
    case BlockTypes.MAIN_FEED:
      settings.blocks.mainFeed = !settings.blocks.mainFeed;
      break;
    case BlockTypes.SUB_FEED:
      settings.blocks.subFeed = !settings.blocks.subFeed;
      break;
    case BlockTypes.COMMENTS:
      settings.blocks.comments = !settings.blocks.comments;
      break;
    case BlockTypes.SEARCH:
      settings.blocks.search = !settings.blocks.search;
      break;
    case BlockTypes.USER_FEED:
      settings.blocks.userFeed = !settings.blocks.userFeed;
      break;
    case BlockTypes.SIDEBAR:
      settings.blocks.sidebar = !settings.blocks.sidebar;
      break;
    case BlockTypes.REDDIT_LOGO:
      settings.blocks.redditLogo = !settings.blocks.redditLogo;
      break;
  }

  await storageFunctions.setSettings(settings);
};
