/* eslint-disable @typescript-eslint/no-use-before-define */
import { RedditSecBlockConfig } from "./chrome/block-section-config";
import { MessageType } from "./chrome/message-types";
import BlockController from "./chrome/block-controller";
import logger from "./chrome/logger";

const blocker = new BlockController(document.URL);

// Recieve messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.info("Message Recieved");
  if (message.type === MessageType.HIDE_ELEMENTS) blocker.hideElements(message.payload as RedditSecBlockConfig[]);
  if (message.type === MessageType.HIDE_BLOCKER) blocker.hideBlockerElement();
  sendResponse();
});
