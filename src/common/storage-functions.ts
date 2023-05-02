import { BlockerSettings } from "./settings-config";

export default interface StorageFunctions {
  getSettings: () => Promise<BlockerSettings>;
  setSettings: (settings: BlockerSettings) => Promise<void>;
  resetSettings: () => Promise<void>;
  initializeSettings: () => Promise<void>;
  sendSettingsResetMessage: () => Promise<void> | void;
}
