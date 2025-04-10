import storageFunctions from "../common/storage-service";
import logger from "../common/util/logger";
import { MessageType, SettingsUpdateMessage } from "../common/message-types";

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
};

main();
