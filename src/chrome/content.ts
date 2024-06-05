/* eslint-disable @typescript-eslint/no-use-before-define */
import { RedditSecBlockConfig } from "../common/types";
import { MessageType } from "../common/message-types";
import { persistServiceWorker } from "../chrome/persist-service-worker";
import logger from "../common/util/logger";

const main = () => {
  logger.info("Hello from content script");

  // Recieve messages from service worker
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logger.info("Message Recieved");
    if (message.type === MessageType.HIDE_ELEMENTS) console.log("why");
    if (message.type === MessageType.HIDE_BLOCKER) console.log("why");
    sendResponse();
  });

  persistServiceWorker();
};

main();
