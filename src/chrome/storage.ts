import { MessageType } from "../common/message-types";
import { BlockerSettings, StorageFunctions, defaultSettings, Blocks, parseMode } from "../common/settings-config";
import logger from "../common/util/logger";

const getSettings = async (): Promise<BlockerSettings> => {
  const storage = await chrome.storage.sync.get("options");
  const settingsFromStore = storage.options;

  // Map the blocks to the correct type
  const mappedBlocks: Blocks = {
    all: settingsFromStore.blocks.all,
    comments: settingsFromStore.blocks.comments,
    mainFeed: settingsFromStore.blocks.mainFeed,
    sidebar: settingsFromStore.blocks.sidebar,
    search: settingsFromStore.blocks.search,
    userFeed: settingsFromStore.blocks.userFeed,
  };

  const mappedSettings: BlockerSettings = {
    enabled: settingsFromStore.enabled,
    mode: parseMode(settingsFromStore.mode),
    blacklist: settingsFromStore.blacklist,
    whitelist: settingsFromStore.whitelist,
    blocks: mappedBlocks,
  };

  return mappedSettings;
};

const setSettings = async (settings: BlockerSettings) => {
  await chrome.storage.sync.set({ options: settings });
};

const resetSettings = async () => {
  await chrome.storage.sync.clear();
  await chrome.storage.sync.set({ options: defaultSettings });
};

const initializeSettings = async () => {
  chrome.storage.sync.get("options").then((val) => {
    if (Object.keys(val).length === 0) {
      chrome.storage.sync.set({ options: defaultSettings });
    }
  });
  logger.info("Initialised settings!");
};

const sendSettingsResetMessage = () => {
  logger.info("Sending settings reset message");
  chrome.runtime.sendMessage({
    type: MessageType.SETTINGS_UPDATE,
  });
};

const ChromeStorageFunctions: StorageFunctions = {
  getSettings,
  setSettings,
  resetSettings,
  initializeSettings,
  sendSettingsResetMessage,
};

export default ChromeStorageFunctions;
