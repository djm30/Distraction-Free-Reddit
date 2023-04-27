export const enum MessageType {
  HIDE_BLOCKER = "HIDE_BLOCKER",
  HIDE_ELEMENTS = "HIDE_ELEMENTS",
  SETTINGS_UPDATE = "SETTINGS_UPDATE",
  WAKE_UP = "WAKE_UP",
}

export interface Message {
  type: MessageType;
  className?: string;
}
