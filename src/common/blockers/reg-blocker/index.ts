import { parseUrl } from "../../util/url-parser";
import { BlockerSettings } from "../../settings-config";
import { Blocker, RedditSecBlockConfig } from "../../types";
import * as Helpers from "./helper";
import DOMController from "../../util/dom-controller";
import REG_SECTIONS from "./sections";
import TrendingNews from "./trending-news-block";
import VideoBlocker from "./videos-block";

let parent: HTMLElement;
let blocker: HTMLDivElement;
let currentlyBlocked: RedditSecBlockConfig[];

const block = (url: string, settings: BlockerSettings) => {
  DOMController.placeBlocker(parent, blocker);
  const sectionsToBlock = parseUrl(url, settings, REG_SECTIONS, Helpers.isUserProfile);

  if (!settings.enabled) {
    Helpers.showAll(currentlyBlocked, blocker);
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

    TrendingNews.block(settings);
    VideoBlocker.block(settings);
  });
};

const onload = (url: string, settings: BlockerSettings) => {
  parent = document.querySelector("body") as HTMLElement;
  blocker = Helpers.createBlocker();
  TrendingNews.initialise(settings);
  VideoBlocker.initialise(settings);
  block(url, settings);
};

const RegBlocker: Blocker = {
  block,
  onload,
};

export default RegBlocker;
