import { RedditSecBlockConfig } from "./chrome/block-section-config";
import { Message, MessageType } from "./chrome/message-types";
import { initializeSettings, getSettings, BlockerSettings } from "./chrome/settings-config";
import { parseUrl } from "./chrome/url-parser";
import logger from "./chrome/logger";

// Using immediately invoked function expression to essentially achieve top level await
// Fixes issue where message wasn't being sent after worker was woken up, as the settings had yet to be retrieved
// It will now await the loading of settings before responding to events
(async () => {
  await initializeSettings();

  let settings: BlockerSettings;
  const setSettings = async () => {
    settings = await getSettings();
    logger.info("Settings loaded");
  };

  await setSettings();

  const getSectionsAndPublish = (url: string, tabId: number, settings: BlockerSettings) => {
    const sections = parseUrl(url, settings);
    publishMessages(tabId, sections);
  };

  // Listening for settings change event to change the settings loaded into memory
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === MessageType.SETTINGS_UPDATE) {
      logger.info("Updating settings");

      // Retrieving enabled status of extension before updated settings
      let wasEnabled = settings.enabled;

      await setSettings();

      // Getting all currently open reddit tabs
      const tabs = await chrome.tabs.query({
        url: "*://*.reddit.com/*",
      });

      tabs.forEach((tab) => {
        if (!tab.active) {
          // Getting new sections that need to be blocked according to new settings
          getSectionsAndPublish(tab.url as string, tab.id as number, settings);
          // const sections = parseUrl(tab.url as string, settings);
          // publishMessages(tab.id as number, sections);
        }
      });
    }
  });

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

  const publishMessages = (tabId: number, sections: RedditSecBlockConfig[]) => {
    // If there is no sections that need blocked
    const errorCallback = () => {
      if (chrome.runtime.lastError) {
        logger.info("Content Script not ready to recieve messages yet");
      }
    };

    try {
      if (!sections.length) {
        // Send a message that will hide the blocker, incase its on the page currently
        chrome.tabs.sendMessage(
          tabId,
          {
            type: MessageType.HIDE_BLOCKER,
          },
          errorCallback
        );
      } else {
        chrome.tabs.sendMessage(
          tabId,
          {
            type: MessageType.HIDE_ELEMENTS,
            payload: sections,
          },
          errorCallback
        );
      }
    } catch (e) {}

    logger.info("Message sent");
  };
})();
