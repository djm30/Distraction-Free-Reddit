import { BlockerSettings, StorageFunctions, defaultSettings, Blocks, parseMode } from "../common/settings-config";
import { MessageType } from "../common/message-types";
import logger from "../common/util/logger";

const getSettings = async (): Promise<BlockerSettings> => {
  const storage = await browser.storage.sync.get("options");
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

const setSettings = async (settings: any) => {
  await browser.storage.sync.set({ options: settings });
};

const resetSettings = async () => {
  await browser.storage.sync.clear();
  await browser.storage.sync.set({ options: defaultSettings });
};

const initializeSettings = async () => {
  logger.info("Settings initialized");
  browser.storage.sync.get("options").then((val) => {
    if (Object.keys(val).length === 0) {
      browser.storage.sync.set({ options: defaultSettings });
    }
  });
};

const sendSettingsResetMessage = async () => {
  logger.info("Sending settings reset message");
  const port = browser.runtime.connect({ name: "settings" });
  port.postMessage({ type: MessageType.SETTINGS_UPDATE });
};

const FirefoxStorageFunctions: StorageFunctions = {
  getSettings,
  setSettings,
  resetSettings,
  initializeSettings,
  sendSettingsResetMessage,
};

export default FirefoxStorageFunctions;
