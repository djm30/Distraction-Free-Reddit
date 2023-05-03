import storageFunctions from "../common/storage-service";
import { parseUrl } from "../common/url-parser";
import logger from "../common/logger";
import { MessageType, Message, HideElementsMessage, SettingsUpdateMessage } from "../common/message-types";

const main = async () => {
  await storageFunctions.initializeSettings();
  let settings = await storageFunctions.getSettings();
  logger.info("Settings loaded");

  let ports: browser.runtime.Port[] = [];
  browser.runtime.onConnect.addListener((port) => {
    // Handling content scripts
    if (port.name === "content") {
      // Adding port to list of ports
      ports.push(port);

      port.onMessage.addListener((msg: any) => {
        if (msg.type === MessageType.WAKE_UP) logger.info("Recieved wake up message");
      });

      // Disconnecting port when tab is closed
      port.onDisconnect.addListener(() => {
        ports = ports.filter((p) => p.sender?.tab?.id !== port.sender?.tab?.id);
      });
    }
    if (port.name === "settings") {
      // Updating value of settings when settings are updated
      storageFunctions.getSettings().then((s) => {
        settings = s;
        logger.info("Updating settings");
        let message: SettingsUpdateMessage = { type: MessageType.SETTINGS_UPDATE, payload: settings };
        // Sending message to content scripts to update settings and adjust the blocker
        ports.forEach((p) => {
          p.postMessage(message);
        });
        port.disconnect();
      });
    }
  });

  // Checking for url changes on reddit tabs
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.startsWith("https://www.reddit.com")) {
      // Getting what sections need to be blocked based on current settings and the new tab url
      const sectionsToBlock = parseUrl(tab.url, settings);
      let message: Message | HideElementsMessage;
      if (sectionsToBlock.length > 0)
        message = { type: MessageType.HIDE_ELEMENTS, payload: sectionsToBlock } as HideElementsMessage;
      else message = { type: MessageType.HIDE_BLOCKER } as Message;

      // Sending message to appropiate tab
      ports.find((p) => p.sender?.tab?.id === tabId)?.postMessage(message);
    }
  });
};

main();
