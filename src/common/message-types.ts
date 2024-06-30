import { BlockerSettings } from "./settings-config";
import { RedditSecBlockConfig } from "./types";

export const enum MessageType {
  SETTINGS_UPDATE = "SETTINGS_UPDATE",
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
