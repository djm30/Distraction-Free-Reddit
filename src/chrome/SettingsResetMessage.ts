import { MessageType } from "./message-types";

export const sendSettingsResetMessage = () => {
  console.log("[INFO] Sending settings reset message");
  chrome.runtime.sendMessage({
    type: MessageType.SETTINGS_UPDATE,
  });
};
