import { BlockerSettings } from "./settings-config";
import { RedditSecBlockConfig } from "./types";

export const enum MessageType {
  HIDE_BLOCKER = "HIDE_BLOCKER",
  HIDE_ELEMENTS = "HIDE_ELEMENTS",
  SETTINGS_UPDATE = "SETTINGS_UPDATE",
  WAKE_UP = "WAKE_UP",
}

export interface Message {
  type: MessageType;
}

export interface HideElementsMessage extends Message {
  payload: RedditSecBlockConfig[];
}

export interface SettingsUpdateMessage extends Message {
  payload: BlockerSettings;
}
