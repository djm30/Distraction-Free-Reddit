import logger from "../common/util/logger";
import { MessageType, Message, HideElementsMessage, SettingsUpdateMessage } from "../common/message-types";
import { BlockerSettings } from "../common/settings-config";
import { Blocker } from "../common/types";
import NewBlocker from "../common/blockers/new-blocker";

let settings: BlockerSettings;
let blocker: Blocker;

const main = () => {
  const port = browser.runtime.connect({ name: "content" });

  // Use the port for listen if the settings have been updated, then update the variable

  // port.onMessage.addListener((msg: any) => {
  //   if (!msg.type) return;
  //   const message: Message = msg;
  //   if (message.type === MessageType.HIDE_ELEMENTS)
  //     blockController.hideElements((message as HideElementsMessage).payload);
  //   else if (message.type === MessageType.HIDE_BLOCKER) blockController.hideBlockerElement();
  //   else if (message.type === MessageType.SETTINGS_UPDATE) {
  //     blockController.setSettings((message as SettingsUpdateMessage).payload);
  //     blockController.placeBlocksUrl(document.URL);
  //   }
  // });
  //
  //

  port.onMessage.addListener((msg: any) => {
    if (!msg.type) return;
    const message: Message = msg;
    switch (message.type) {
      case MessageType.SETTINGS_UPDATE:
        logger.info("Settings update");
        break;
      default:
        logger.warn(`Received unknown message of type ${message.type}`);
        break;
    }
  });

  let url = "";

  blocker = NewBlocker;

  // Deterine what site / design is being used, old.reddit new.reddit, reddit but with new or old design, then assign the appropiate blocker

  const observer = new MutationObserver((mutations) => {
    if (url !== document.URL) {
      // URL Changed
      console.log(document.URL);
      console.log("URL Changed");
      blocker.block(url, settings);
      url = document.URL;
    }
    mutations.forEach((mutation) => {});
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", (event) => {
    blocker.onload(document.URL, settings);
  });

  // Keeping event page active

  // Will be needed if I switch back to manifest v3
  // setInterval(() => {
  //   port.postMessage({ type: MessageType.WAKE_UP });
  // }, 10000);

  logger.info("Content script loaded");
};

main();
