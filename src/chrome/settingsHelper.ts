import { MessageType } from "./messages";

export const sendSettingsResetMessage = () => {
    chrome.runtime.sendMessage({
        type: MessageType.SETTINGS_UPDATE,
    });
};
