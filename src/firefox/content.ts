import BlockController from "../common/block-controller";
import { RedditSecBlockConfig } from "../common/block-section-config";
import logger from "../common/logger";
import { MessageType, Message } from "../common/message-types";

const main = () => {
  const blockController = new BlockController(document.URL);

  const port = browser.runtime.connect({ name: "content" });

  port.onMessage.addListener((msg: any) => {
    if (!msg.type) return;
    const message: Message = msg;
    console.log("Content script received message:", message);
    if (message.type === MessageType.HIDE_ELEMENTS)
      blockController.hideElements(message.payload as RedditSecBlockConfig[]);
    if (message.type === MessageType.HIDE_BLOCKER) blockController.hideBlockerElement();
    if (message.type === MessageType.SETTINGS_UPDATE)
      blockController.hideElements(message.payload as RedditSecBlockConfig[]);
  });

  logger.info("Content script loaded");
};

main();
