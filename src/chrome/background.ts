import { RedditSecBlockConfig } from "../common/block-section-config";
import { HideElementsMessage, Message, MessageType } from "../common/message-types";
import { BlockerSettings } from "../common/settings-config";
import storageFunctions from "../common/storage-service";
import { parseUrl } from "../common/url-parser";
import logger from "../common/logger";

const publishBlockMessage = (tabId: number, sections: RedditSecBlockConfig[]) => {
  // If there is no sections that need blocked
  const errorCallback = () => {
    if (chrome.runtime.lastError) {
      logger.error("Content Script not ready to recieve messages yet");
    }
  };

  try {
    if (!sections.length) {
      // Send a message that will hide the blocker, incase its on the page currently
      const message: Message = { type: MessageType.HIDE_BLOCKER };
      chrome.tabs.sendMessage(tabId, message, errorCallback);
    } else {
      const message: HideElementsMessage = { type: MessageType.HIDE_ELEMENTS, payload: sections };
      chrome.tabs.sendMessage(tabId, message, errorCallback);
    }
  } catch (e) {
    logger.error(`Error sending message to content script, ${(e as Error).message}`);
  }

  logger.info("Message sent");
};

const getSectionsAndPublish = (url: string, tabId: number, settings: BlockerSettings) => {
  const sections = parseUrl(url, settings);
  publishBlockMessage(tabId, sections);
};

const main = async () => {
  await storageFunctions.initializeSettings();

  let settings: BlockerSettings = await storageFunctions.getSettings();
  logger.info("Settings loaded");

  // Adding event listener for incoming settings update messages
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // If settings are updated, update settings and send messages to all reddit tabs to adjust blocks accordingly
    if (message.type === MessageType.SETTINGS_UPDATE) {
      logger.info("Updating settings");

      settings = await storageFunctions.getSettings();

      // Getting all currently open reddit tabs
      const tabs = await chrome.tabs.query({
        url: "*://*.reddit.com/*",
      });

      tabs.forEach((tab) => {
        if (!tab.active) {
          // Getting new sections that need to be blocked according to new settings
          getSectionsAndPublish(tab.url as string, tab.id as number, settings);
        }
      });
    } else if (message.type === MessageType.WAKE_UP) {
      logger.info("Recieved wake up message");
    }

    sendResponse();
  });

  // Adding event listener for reddit tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Waiting for settings to be loaded
    if (changeInfo.url?.startsWith("https://www.reddit")) {
      if (settings.enabled) {
        getSectionsAndPublish(tab.url as string, tab.id as number, settings);
        // const sections = parseUrl(changeInfo.url, settings);
        // publishMessages(tabId, sections);
      }
    }
  });
};

main();
