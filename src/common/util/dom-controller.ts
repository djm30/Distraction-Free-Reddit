import logger from "./logger";
import { RedditSecBlockConfig } from "../types";

const hideElement = (section: RedditSecBlockConfig) => {
  if (!section.selectors.length) return;
  section.selectors.forEach((selector) => {
    try {
      const element = document.querySelector(selector) as HTMLDivElement | null;
      /// If element is not found, its probably because its not in the dom yet, so retry for a bit
      if (!element) return hideElementWithRetry(selector);
      // Hiding element by setting display to none
      element.style.display = "none";
    } catch (e) {
      logger.info(`No element found for corresponding selector: ${selector}`);
    }
  });
};

const hideElementWithRetry = (selector: string): void => {
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
};

const showElement = (section: RedditSecBlockConfig) => {
  if (!section.selectors.length) return;
  section.selectors.forEach((selector) => {
    try {
      const element = document.querySelector(selector) as HTMLDivElement | null;
      if (!element) return logger.error(`Failed to hide element with selector: ${selector}`);

      if (element.style.display === "none") element.style.removeProperty("display");
    } catch (e) {
      logger.info(`No element found for corresponding selector: ${selector}`);
    }
  });
};

const hideBlockerElement = (blocker: HTMLDivElement) => {
  blocker.style.display = "none";
};

const showBlockerElement = (blocker: HTMLDivElement, message: string) => {
  blocker.style.removeProperty("display");
  blocker.innerText = message;
};

const placeBlocker = (parent: HTMLElement, blocker: HTMLDivElement) => {
  const isBlockerOnPage = document.querySelector("#blocker");
  if (isBlockerOnPage) {
    return;
  }

  logger.info("Placing Blocker on page");
  parent.prepend(blocker);
};

const DOMHelper = {
  hideElement,
  hideElementWithRetry,
  showElement,
  hideBlockerElement,
  showBlockerElement,
  placeBlocker,
};

export default DOMHelper;
