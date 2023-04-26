import { MessageType } from "./message-types";
import logger from "./logger";

export const sendSettingsResetMessage = () => {
  logger.info("[INFO] Sending settings reset message");
  chrome.runtime.sendMessage({
    type: MessageType.SETTINGS_UPDATE,
  });
};
