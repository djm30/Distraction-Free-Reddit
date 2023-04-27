import { RedditSecBlockConfig } from "./block-section-config";
import { isDarkMode, isUserProfile } from "./content-utils";
import { getSettings, BlockerSettings } from "./settings-config";
import { parseUrl } from "./url-parser";

export default class BlockController {
  blockerPlaceRetryInterval!: ReturnType<typeof setInterval>;
  settings!: BlockerSettings;
  blocker!: HTMLDivElement;
  parent!: HTMLDivElement;

  constructor(url: string) {
    getSettings().then((settings) => {
      this.settings = settings;

      this.initialiseBlocker();
      this.placeBlockerOnPage();
      this.placeBlocksOnPageLoad(url);
    });

    window.addEventListener("load", () => this.clearRetryInterval());
  }

  public initialiseBlocker(): void {
    const darkModeOn = isDarkMode();
    const fontColor = darkModeOn ? "white" : "black";
    const bgColor = darkModeOn ? "#030303" : "#DAE0E6";

    // Creating blocker element
    const blockerStyles = `position: fixed; top: 48px;
                        width: 100%; height: 100vh; z-index: 79;
                        background: ${bgColor}; text-align: center;
                        font-size: 20px; color: ${fontColor}; padding-top: 40px;`;
    const blockerElement = document.createElement("div");
    blockerElement.id = "blocker";
    blockerElement.style.cssText = blockerStyles;

    // We are going to hide the blocker element by default, it will then be hidden when needed
    // blockerElement.style.display = "none";
    blockerElement.innerText = "Distraction Free Reddit is loading...";

    const parent = document.querySelector("header")?.parentElement as HTMLDivElement;

    this.blocker = blockerElement;
    this.parent = parent;
  }

  public placeBlockerOnPage(): void {
    if (document.readyState !== "complete") {
      this.blockerPlaceRetryInterval = setInterval(() => {
        // Check if blocker element has already been appended
        if (this.parent.contains(this.blocker)) return;
        this.parent.appendChild(this.blocker);
      }, 250);
    }
  }

  public placeBlocksOnPageLoad(url: string): void {
    // I dont like having to import this function here and also the background script
    // Maybe I should send the url in a message in a background script and then parse it there
    // But it may take too long and delay the blocker from being placed on the page so probably better for now
    const sections = parseUrl(url, this.settings);
    this.hideElements(sections);
  }

  private clearRetryInterval(): void {
    console.log("[INFO] Distraction Free Reddit Loaded!");
    clearInterval(this.blockerPlaceRetryInterval);
  }

  public hideElements(sectionsToBlock: RedditSecBlockConfig[]): void {
    console.log("Message Recieved");
    if (isUserProfile()) return;
    let useFullPageBlocker = false;
    let blockMessage = "";
    sectionsToBlock.forEach((section) => {
      // Need to ensure that if one section uses the full page blocker, it wont be overwriiten
      // Also need to ensure that if one section is to be shown, and its current display is set to none, that it should be removed
      // And also need to ensure that if a section is not to be shown, and also doesnt use the blocker, then its display will be set to none
      if (section.useBlocker) {
        useFullPageBlocker = true;
        blockMessage = section.blockMsg;
      }

      section.show ? this.showElement(section) : this.hideElement(section);
    });

    useFullPageBlocker ? this.showBlockerElement(blockMessage) : this.hideBlockerElement();
  }

  private hideElement(section: RedditSecBlockConfig) {
    if (!section.selector) return;
    try {
      const element = document.querySelector(section.selector) as HTMLDivElement | null;
      if (!element) throw new Error("No element found for corresponding selector");
      // Hiding element by setting display to none
      element.style.display = "none";
    } catch (e) {
      console.log(`[INFO] No element found for corresponding selector: ${section.selector}`);
    }
  }

  private showElement(section: RedditSecBlockConfig) {
    if (!section.selector) return;
    try {
      const element = document.querySelector(section.selector) as HTMLDivElement | null;
      if (!element) throw new Error("No element found for corresponding selector");

      if (element.style.display === "none") element.style.removeProperty("display");
    } catch (e) {
      console.log(`[INFO] No element found for corresponding selector: ${section.selector}`);
    }
  }

  public hideBlockerElement(): void {
    this.blocker.style.display = "none";
  }

  private showBlockerElement(message: string): void {
    this.blocker.style.removeProperty("display");
    this.blocker.innerText = message;
  }
}