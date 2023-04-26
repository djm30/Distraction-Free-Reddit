/* eslint-disable @typescript-eslint/no-use-before-define */
import { RedditSecBlockConfig } from "./chrome/block-section-config";
import { MessageType } from "./chrome/message-types";
import Blocker from "./chrome/blocker";

const blocker = new Blocker(document.URL);

// Recieve messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[INFO] Message Recieved");
  if (message.type === MessageType.HIDE_ELEMENTS) blocker.hideElements(message.payload as RedditSecBlockConfig[]);
  if (message.type === MessageType.HIDE_BLOCKER) blocker.hideBlockerElement();
  sendResponse();
});
