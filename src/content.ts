import { BlockSection } from "./chrome/cssclassnames";
import { MessageType } from "./chrome/messages";
import { getSettings } from "./chrome/storage";
import { parseUrl } from "./chrome/urlparser";
import { isDarkMode, isUserProfile } from "./chrome/contentUtils";

// Making chat appear above blocker element
// ((document.querySelector("._1ScY1cHS-Vgv6eoU-LmjTi") as HTMLDivElement).parentElement as HTMLDivElement).style.zIndex = "100";

const darkModeOn = isDarkMode();
console.log(darkModeOn);
const fontColor = darkModeOn ? "white" : "black";
const bgColor = darkModeOn ? "#030303" : "#dae0e6";

// Creating blocker element
const blockerStyles = `position: fixed; top: 48px;
                    width: 100%; height: 100vh; z-index: 79;
                    background: ${bgColor}; text-align: center;
                    font-size: 20px; color: ${fontColor}; padding-top: 40px;`
const blockerElement = document.createElement("div");
blockerElement.id = "blocker";
blockerElement.style.cssText = blockerStyles;
blockerElement.style.display = "none"
const parent = document.querySelector("header")?.parentElement as HTMLDivElement;

let interval: ReturnType<typeof setInterval>

if (document.readyState !== "complete") {
    interval = setInterval(() => {
        parent.appendChild(blockerElement);
    }, 250)

    let interval2 = setInterval(() => {
        // Hiding elements on initial page load
        getSettings().then(settings => {
            if (settings.enabled) {
                if (!isUserProfile()) {
                    parseUrl(document.URL, settings).forEach(section => {
                        hideSection(section);
                    })
                }
            }
        })
    }, 125)

    setTimeout(() => {
        clearInterval(interval2);
    }, 2000)
}

window.addEventListener("load", () => {
    console.log("Distraction Free Reddit Loaded!");
    clearInterval(interval)
    console.log(parent);
})

// Recieve messages from frontend
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === MessageType.HIDE_ELEMENTS) {
        const section = message.payload as BlockSection;
        hideSection(section);
        if (isUserProfile()) {
            console.log("This is my own profile");
            blockerElement.style.display = "none";
        }
    }
});


const showHideElement = (section: BlockSection) => {
    const element = document.querySelector(
        section.selector,
    ) as HTMLDivElement | null;
    if (element) {
        if (!section.show) {
            element.style.display = "none";
        } else element.style.removeProperty("display");
    }
};

const hideSection = (section: BlockSection) => {
    if (section.useBlocker) {
        blockerElement.style.removeProperty("display")
        blockerElement.innerText = section.blockMsg;
    }
    else {
        blockerElement.style.display = "none";
    }
    hideWithRetries(section, 1000);
}

const hideWithRetries = (element: BlockSection, time = 750) => {
    let interval = setInterval(() => { showHideElement(element) }, 250)
    let timeout = setTimeout(() => {
        clearInterval(interval)
    }, time)

    return [interval, timeout];
}