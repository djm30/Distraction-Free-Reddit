import { MessageType, SettingsUpdateMessage } from "../common/message-types";
import { BlockerSettings } from "../common/settings-config";
import storageFunctions from "../common/storage-service";
import logger from "../common/util/logger";

const publishUpdateSettingsMessage = (tabId: number, settings: BlockerSettings) => {
  const errorCallback = () => {
    if (chrome.runtime.lastError) {
      logger.error("Content Script not ready to recieve messages yet");
    }
  };

  try {
    const message: SettingsUpdateMessage = { type: MessageType.SETTINGS_UPDATE, payload: settings };
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
      logger.info("Updating settings");

      const settings = await storageFunctions.getSettings();

      // Getting all currently open reddit tabs
      const tabs = await chrome.tabs.query({
        url: "*://*.reddit.com/*",
      });

      tabs.forEach((tab) => {
        publishUpdateSettingsMessage(tab.id as number, settings);
      });
    }

    sendResponse();
  });
};

main();
