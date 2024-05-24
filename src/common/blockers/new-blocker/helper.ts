import logger from "../../util/logger";
import { RedditSecBlockConfig } from "../../types";

const hideElement = (section: RedditSecBlockConfig) => {
  if (!section.selector) return;
  try {
    const element = document.querySelector(section.selector) as HTMLDivElement | null;
    /// If element is not found, its probably because its not in the dom yet, so retry for a bit
    if (!element) return hideElementWithRetry(section.selector);
    // Hiding element by setting display to none
    element.style.display = "none";
  } catch (e) {
    logger.info(`No element found for corresponding selector: ${section.selector}`);
  }
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
  if (!section.selector) return;
  try {
    const element = document.querySelector(section.selector) as HTMLDivElement | null;
    if (!element) return logger.error(`Failed to hide element with selector: ${section.selector}`);

    if (element.style.display === "none") element.style.removeProperty("display");
  } catch (e) {
    logger.info(`No element found for corresponding selector: ${section.selector}`);
  }
};

const hideBlockerElement = (blocker: HTMLDivElement) => {
  blocker.style.display = "none";
};

const showBlockerElement = (blocker: HTMLDivElement, message: string) => {
  blocker.style.removeProperty("display");
  blocker.innerText = message;
};

export { hideElement, hideElementWithRetry, showElement, hideBlockerElement, showBlockerElement };
