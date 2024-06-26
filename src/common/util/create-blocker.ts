import { parseUrl } from "./url-parser";
import { BlockerSettings } from "../settings-config";
import { Blocker, BlockSections, RedditSecBlockConfig } from "../types";
import DOMController from "./dom-controller";

interface Helpers {
  isUserProfile: (urlUsername: string) => boolean;
  isDarkMode: () => boolean;
  createBlocker: () => HTMLDivElement;
  showAll: (currentlyBlocked: RedditSecBlockConfig[], blocker: HTMLDivElement) => void;
}

const createBlocker = (
  sections: BlockSections,
  helper: Helpers,
  parent: HTMLElement,
  blocker: HTMLDivElement,
  currentlyBlocked: RedditSecBlockConfig[],
) => {
  const block = (url: string, settings: BlockerSettings) => {
    DOMController.placeBlocker(parent, blocker);
    const sectionsToBlock = parseUrl(url, settings, sections, helper.isUserProfile);

    if (!settings.enabled) {
      helper.showAll(currentlyBlocked, blocker);
    }
    sectionsToBlock.forEach((section) => {
      let useFullPageBlocker = false;
      let blockMessage = "";
      currentlyBlocked = [];

      // Will show any hidden elements
      sectionsToBlock.filter((section) => section.show).forEach(DOMController.showElement);

      // Hide elements after, otherwise hidden element might get overwritten if they share the same selector
      sectionsToBlock
        .filter((section) => !section.show)
        .forEach((section) => {
          if (section.useBlocker) {
            useFullPageBlocker = true;
            blockMessage = section.blockMsg;
          }

          currentlyBlocked.push(section);
          DOMController.hideElement(section);
        });

      useFullPageBlocker
        ? DOMController.showBlockerElement(blocker, blockMessage)
        : DOMController.hideBlockerElement(blocker);
    });
  };

  const onload = (url: string, settings: BlockerSettings) => {
    parent = document.querySelector("body") as HTMLElement;
    blocker = helper.createBlocker();
    block(url, settings);
  };

  const blockerObject: Blocker = {
    block,
    onload,
  };

  return blockerObject;
};

export { createBlocker };
