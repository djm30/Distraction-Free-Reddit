import { BlockSection } from "./chrome/cssclassnames";
import { MessageType } from "./chrome/messages";
import { getSettings } from "./chrome/storage";
import { parseUrl } from "./chrome/urlparser";

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

const isDarkMode = () => {
    let darkMode = false;
    let element = document.querySelector("._1VP69d9lk-Wk9zokOaylL") as HTMLElement;
    element.style.cssText.split(" ").forEach(style => {
        console.log(style);
        if (style.startsWith("--background:")) {
            let bodyColor = style.split("#")[1];
            darkMode = bodyColor !== "FFFFFF;"
        }
    })
    return darkMode;
}

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

        // Hiding elements on initial page load
        getSettings().then(settings => {
            parseUrl(document.URL, settings).forEach(section => {
                hideSection(section);
            })
        })
    }, 50)
}

window.addEventListener("load", () => {
    console.log("Loaded!")
    clearInterval(interval)
    console.log(parent);
})

console.log("Distraction Free Reddit Loaded!");


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === MessageType.HIDE_ELEMENTS) {
        const section = message.payload as BlockSection;
        console.log(section);
        hideSection(section);
    }
});


const hideSection = (section: BlockSection) => {
    if (section.useBlocker) {
        blockerElement.style.removeProperty("display")
        blockerElement.innerText = section.blockMsg;
    }
    else {
        blockerElement.style.display = "none";
    }
    hideWithRetries(section, 5000);
}

const hideWithRetries = (element: BlockSection, time = 750) => {
    let interval = setInterval(() => { showHideElement(element) }, 50)
    let timeout = setTimeout(() => {
        clearInterval(interval)
    }, time)

    return [interval, timeout];
}
export { };
