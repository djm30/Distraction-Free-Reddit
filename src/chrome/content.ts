/* eslint-disable @typescript-eslint/no-use-before-define */
import { RedditSecBlockConfig } from "../common/block-section-config";
import { MessageType } from "../common/message-types";
import BlockController from "../common/block-controller";
import { persistServiceWorker } from "../chrome/persist-service-worker";
import logger from "../common/logger";

const main = () => {
  const blocker = new BlockController(document.URL);

  logger.info("Hello from content script");

  // Recieve messages from service worker
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logger.info("Message Recieved");
    if (message.type === MessageType.HIDE_ELEMENTS) blocker.hideElements(message.payload as RedditSecBlockConfig[]);
    if (message.type === MessageType.HIDE_BLOCKER) blocker.hideBlockerElement();
    sendResponse();
  });

  persistServiceWorker();
};

main();
