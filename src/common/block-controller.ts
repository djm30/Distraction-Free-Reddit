import { RedditSecBlockConfig } from "./block-section-config";
import { isDarkMode, isUserProfile } from "./content-utils";
import storageFunctions from "./storage-service";
import { BlockerSettings } from "./settings-config";
import { parseUrl } from "./url-parser";
import logger from "./logger";

export default class BlockController {
  settings!: BlockerSettings;
  blocker!: HTMLDivElement;
  parent!: HTMLDivElement;

  constructor(url: string) {
    storageFunctions.getSettings().then((settings) => {
      this.settings = settings;

      this.initialiseBlocker();
      this.placeBlockerOnPage();
      this.placeBlocksUrl(url);
    });
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
    if (isUserProfile()) blockerElement.style.display = "none";
    blockerElement.innerText = "Distraction Free Reddit is loading...";

    const parent = document.querySelector("header")?.parentElement as HTMLDivElement;

    this.blocker = blockerElement;
    this.parent = parent;
  }

  public placeBlockerOnPage(): void {
    let blockerPlaceRetryInterval: ReturnType<typeof setInterval>;
    if (document.readyState !== "complete") {
      blockerPlaceRetryInterval = setInterval(() => {
        // Check if blocker element has already been appended
        if (this.parent.contains(this.blocker)) return;
        logger.debug("Retrying to place blocker on page");
        this.parent.appendChild(this.blocker);
      }, 100);
    }

    window.addEventListener("load", () => {
      setTimeout(() => {
        clearInterval(blockerPlaceRetryInterval);
      }, 1000);
      logger.info("Distraction Free Reddit Loaded");
      if (!this.parent.contains(this.blocker)) this.parent.appendChild(this.blocker);
    });
  }

  public setSettings(settings: BlockerSettings): void {
    this.settings = settings;
  }

  public placeBlocksUrl(url: string): void {
    // I dont like having to import this function here and also the background script
    // Maybe I should send the url in a message in a background script and then parse it there
    // But it may take too long and delay the blocker from being placed on the page so probably better for now
    const sections = parseUrl(url, this.settings);
    this.hideElements(sections);
  }

  public hideElements(sectionsToBlock: RedditSecBlockConfig[]): void {
    if (isUserProfile()) {
      this.hideBlockerElement();
      return;
    }
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
      /// If element is not found, its probably because its not in the dom yet, so retry for a bit
      if (!element) return this.hideElementWithRetry(section.selector);
      // Hiding element by setting display to none
      element.style.display = "none";
    } catch (e) {
      logger.info(`No element found for corresponding selector: ${section.selector}`);
    }
  }

  private showElement(section: RedditSecBlockConfig) {
    if (!section.selector) return;
    try {
      const element = document.querySelector(section.selector) as HTMLDivElement | null;
      if (!element) throw new Error("No element found for corresponding selector");

      if (element.style.display === "none") element.style.removeProperty("display");
    } catch (e) {
      logger.info(`No element found for corresponding selector: ${section.selector}`);
    }
  }

  public hideBlockerElement(): void {
    this.blocker.style.display = "none";
  }

  public hideElementWithRetry(selector: string): void {
    let elementHidden = false;

    const retryInterval = setInterval(() => {
      const element = document.querySelector(selector) as HTMLDivElement | null;
      if (!element) return;

      element.style.display = "none";
      elementHidden = true;
      clearInterval(retryInterval);
    }, 100);

    // Try for 4 seconds
    setTimeout(() => {
      clearInterval(retryInterval);
      if (!elementHidden) logger.error(`Failed to hide element with selector: ${selector}`);
    }, 4000);
  }

  private showBlockerElement(message: string): void {
    this.blocker.style.removeProperty("display");
    this.blocker.innerText = message;
  }
}
