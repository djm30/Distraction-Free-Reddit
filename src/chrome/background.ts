import { Message, MessageType } from "../common/message-types";
import storageFunctions from "../common/storage-service";
import logger from "../common/util/logger";

const publishUpdateSettingsMessage = (tabId: number) => {
  const errorCallback = () => {
    if (chrome.runtime.lastError) {
      logger.error("Content Script not ready to recieve messages yet");
    }
  };

  try {
    const message: Message = { type: MessageType.SETTINGS_UPDATE };
    chrome.tabs.sendMessage(tabId, message, errorCallback);
  } catch (e) {
    logger.error(`Error sending message to content script, ${(e as Error).message}`);
  }

  logger.info("Message sent");
};

const main = async () => {
  await storageFunctions.initializeSettings();

  // Adding event listener for incoming settings update messages
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // If settings are updated, update settings and send messages to all reddit tabs to adjust blocks accordingly
    if (message.type === MessageType.SETTINGS_UPDATE) {
      logger.info("Forwarding settings update to content scripts");

      // Getting all currently open reddit tabs
      const tabs = await chrome.tabs.query({
        url: "*://*.reddit.com/*",
      });

      tabs.forEach((tab) => {
        if (!tab.active) {
          publishUpdateSettingsMessage(tab.id as number);
          // Getting new sections that need to be blocked according to new settings
        }
      });
    }

    sendResponse();
  });
};

main();
