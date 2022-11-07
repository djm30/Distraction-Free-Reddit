import { BlockSection } from "./chrome/cssclassnames";
import { Message, MessageType } from "./chrome/messages";
import {
    initializeSettings,
    getSettings,
    StorageShape,
} from "./chrome/storage";
import { parseUrl } from "./chrome/urlparser";


// Using immediately invoked function expression to essentially achieve top level await
// Fixes issue where message wasn't being sent after worker was woken up, as the settings had yet to be retrieved
// It will now await the loading of settings before responding to events
(async () => {
    await initializeSettings();
    let settings: StorageShape;

    // initializeSettings().then(() => {
    //     console.log("Initialized settings")
    //     setSettings();
    // });

    const setSettings = async () => {
        getSettings().then(retrievedSettings => {
            settings = retrievedSettings;
            console.log("Set settings!")
            console.log(settings);
        })
    }

    await setSettings();

    // Listening for settings change event to change the settings loaded into memory
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === MessageType.SETTINGS_UPDATE) {
            console.log("Updating settings");
            setSettings();

        }
    })

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        console.log(`RECIEVED EVENT AT: ${new Date().toString()}`)

        // Waiting for settings to be loaded
        if (changeInfo.url?.startsWith("https://www.reddit")) {
            if (settings.enabled) {
                const sections = parseUrl(changeInfo.url, settings)
                publishMessages(tabId, sections);
            }
        }
    });

    const publishMessages = (tabId: number, sections: BlockSection[]) => {
        // If there is no sections that need blocked
        if (!sections.length) {
            // Send a message that will hide the blocker, incase its on the page currently
            chrome.tabs.sendMessage(tabId, { type: MessageType.HIDE_BLOCKER })
        } else {
            sections.forEach(section => {
                chrome.tabs.sendMessage(tabId, {
                    type: MessageType.HIDE_ELEMENTS,
                    payload: section
                });
            })
        }
        console.log("Message sent");
    }

})();


