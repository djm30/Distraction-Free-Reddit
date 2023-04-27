import { MessageType } from "./message-types";

export const persistServiceWorker = () => {
  // Every 60 seconds, send a message to the service worker
  // This will keep the service worker alive, and allow it to respond to messages
  let interval = setInterval(() => {
    chrome.runtime.sendMessage({
      type: MessageType.WAKE_UP,
    });
  }, 60000);
  return interval;
};
