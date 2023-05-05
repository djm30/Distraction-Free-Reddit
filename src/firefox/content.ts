import BlockController from "../common/block-controller";
import logger from "../common/logger";
import { MessageType, Message, HideElementsMessage, SettingsUpdateMessage } from "../common/message-types";

const main = () => {
  const blockController = new BlockController(document.URL);

  const port = browser.runtime.connect({ name: "content" });

  port.onMessage.addListener((msg: any) => {
    if (!msg.type) return;
    const message: Message = msg;
    if (message.type === MessageType.HIDE_ELEMENTS)
      blockController.hideElements((message as HideElementsMessage).payload);
    else if (message.type === MessageType.HIDE_BLOCKER) blockController.hideBlockerElement();
    else if (message.type === MessageType.SETTINGS_UPDATE) {
      blockController.setSettings((message as SettingsUpdateMessage).payload);
      blockController.placeBlocksUrl(document.URL);
    }
  });

  // Keeping event page active

  // Will be needed if I switch back to manifest v3
  // setInterval(() => {
  //   port.postMessage({ type: MessageType.WAKE_UP });
  // }, 10000);

  logger.info("Content script loaded");
};

main();
