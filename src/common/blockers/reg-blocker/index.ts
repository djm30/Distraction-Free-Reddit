import { parseUrl } from "../../util/url-parser";
import { BlockerSettings } from "../../settings-config";
import { Blocker } from "../../types";
import * as Helpers from "./helper";
import DOMController from "../../util/dom-controller";
import REG_SECTIONS from "./sections";

let parent: HTMLElement;
let blocker: HTMLDivElement;

const block = (url: string, settings: BlockerSettings) => {
  DOMController.placeBlocker(parent, blocker);
  const sectionsToBlock = parseUrl(url, settings, REG_SECTIONS, Helpers.isUserProfile);

  sectionsToBlock.forEach((section) => {
    let useFullPageBlocker = false;
    let blockMessage = "";

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

        DOMController.hideElement(section);
      });

    useFullPageBlocker
      ? DOMController.showBlockerElement(blocker, blockMessage)
      : DOMController.hideBlockerElement(blocker);
  });
};

const onload = (url: string, settings: BlockerSettings) => {
  parent = document.querySelector("body") as HTMLElement;
  blocker = Helpers.createBlocker();
  block(url, settings);
};

const RegBlocker: Blocker = {
  block,
  onload,
};

export default RegBlocker;
