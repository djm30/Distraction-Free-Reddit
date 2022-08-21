import { BlockSection } from "./chrome/cssclassnames";
import { Message, MessageType } from "./chrome/messages";
import {
    initializeSettings,
    getSettings,
    StorageShape,
} from "./chrome/storage";
import { parseUrl } from "./chrome/urlparser";


let settings: StorageShape;

initializeSettings().then(() => {
    console.log("Initialized settings")
    setSettings();
});

const setSettings = () => {
    getSettings().then(retrievedSettings => {
        settings = retrievedSettings;
        console.log("Set settings!")
    })
}

// Listening for settings change event to change the settings loaded into memory
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === MessageType.SETTINGS_UPDATE) {
        console.log("Updating settings");
        setSettings();
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url?.startsWith("https://www.reddit")) {
        if (settings.enabled) {
            const sections = parseUrl(changeInfo.url, settings)
            console.log(sections);
            publishMessages(tabId, sections);
        }
    }
});

const publishMessages = (tabId: number, sections: BlockSection[]) => {
    sections.forEach(section => {
        chrome.tabs.sendMessage(tabId, {
            type: MessageType.HIDE_ELEMENTS,
            payload: section
        });
    })
    console.log("Message sent");
}
