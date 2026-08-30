import { BlockerSettings, StorageFunctions, defaultSettings, parseStoredSettings } from "../common/settings-config";
import logger from "../common/util/logger";

const getSettings = async (): Promise<BlockerSettings> => {
  const storage = await chrome.storage.sync.get("options");
  return parseStoredSettings(storage.options);
};

const setSettings = async (settings: BlockerSettings) => {
  await chrome.storage.sync.set({ options: settings });
};

const resetSettings = async () => {
  await chrome.storage.sync.clear();
  await chrome.storage.sync.set({ options: defaultSettings });
};

const initializeSettings = async () => {
  const storage = await chrome.storage.sync.get("options");
  if (Object.keys(storage).length === 0) {
    await chrome.storage.sync.set({ options: defaultSettings });
  }
  logger.info("Initialised settings!");
};

const onSettingsChanged = (callback: (settings: BlockerSettings) => void) => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes.options) return;
    callback(parseStoredSettings(changes.options.newValue));
  });
};

const ChromeStorageFunctions: StorageFunctions = {
  getSettings,
  setSettings,
  resetSettings,
  initializeSettings,
  onSettingsChanged,
};

export default ChromeStorageFunctions;
