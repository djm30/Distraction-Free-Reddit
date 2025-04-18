import { Blocker } from "../common/types";
import { MessageType, SettingsUpdateMessage } from "../common/message-types";
import logger from "../common/util/logger";
import storageFunctions from "../common/storage-service";
import { BlockerSettings } from "../common/settings-config";
import OldBlocker from "../common/blockers/old-blocker";
import RegBlocker from "../common/blockers/reg-blocker";
import { dispatchUrlChangedEvent } from "../common/util/url-changed-event";

let settings: BlockerSettings;
let blocker: Blocker;

const main = () => {
  // Recieve messages from service worker
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logger.info("Message Recieved");
    if (message.type === MessageType.SETTINGS_UPDATE) {
      logger.info("Settings update");
      settings = (message as SettingsUpdateMessage).payload;
      blocker.block(document.URL, settings);
    }
    sendResponse();
  });

  // Getting initial URL to track changes later on
  let url = document.URL;

  // Deterine what site / design is being used, old.reddit new.reddit, reddit but with new or old design, then assign the appropiate blocker
  const urlPattern = /^https?:\/\/(old\.|www\.|new\.)?reddit\.com/;
  const match = document.URL.match(urlPattern);
  const subdomain = match![1] || "www.";
  subdomain.slice(0, -1); // Remove the trailing dot from the subdomain

  switch (subdomain.slice(0, -1)) {
    case "new":
      blocker = RegBlocker;
      logger.info("NEW BLOCKER LOADED");
      break;
    case "old":
      blocker = OldBlocker;
      logger.info("OLD BLOCKER LOADED");
      break;
    case "www":
    default:
      blocker = RegBlocker;
      logger.info("REG BLOCKER LOADED");
      break;
  }

  const observer = new MutationObserver((mutations) => {
    if (url !== document.URL) {
      // Updating current URL
      url = document.URL;
      logger.info("URL Changed");
      logger.info(url);

      dispatchUrlChangedEvent(url);
      blocker.block(url, settings);
    } else if (!document.querySelector("#blocker")) {
      logger.info("Blocker was removed");
      blocker.block(url, settings);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", (event) => {
    blocker.onload(document.URL, settings);
  });

  logger.info("Content script loaded");
};

storageFunctions
  .getSettings()
  .then((storedSettings) => {
    settings = storedSettings;
    logger.info("SETTINGS LOADED");
    main();
  })
  .catch((e) => {
    logger.error(e);
  });
