import { BlockerSettings, StorageFunctions, defaultSettings, parseStoredSettings } from "../common/settings-config";
import logger from "../common/util/logger";

const getSettings = async (): Promise<BlockerSettings> => {
  const storage = await browser.storage.sync.get("options");
  return parseStoredSettings(storage.options);
};

const setSettings = async (settings: BlockerSettings) => {
  await browser.storage.sync.set({ options: settings });
};

const resetSettings = async () => {
  await browser.storage.sync.clear();
  await browser.storage.sync.set({ options: defaultSettings });
};

const initializeSettings = async () => {
  const storage = await browser.storage.sync.get("options");
  if (Object.keys(storage).length === 0) {
    await browser.storage.sync.set({ options: defaultSettings });
  }
  logger.info("Initialised settings!");
};

const onSettingsChanged = (callback: (settings: BlockerSettings) => void) => {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes.options) return;
    callback(parseStoredSettings((changes.options as browser.storage.StorageChange).newValue));
  });
};

const FirefoxStorageFunctions: StorageFunctions = {
  getSettings,
  setSettings,
  resetSettings,
  initializeSettings,
  onSettingsChanged,
};

export default FirefoxStorageFunctions;
