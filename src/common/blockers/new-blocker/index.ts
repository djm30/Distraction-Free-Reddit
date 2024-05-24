import { parseUrl } from "../../util/url-parser";
import { BlockerSettings } from "../../settings-config";
import { Blocker } from "../../types";
import { isUserProfile, isDarkMode } from "../../util/content-utils";
import NEW_SECTIONS from "./sections";
import * as Helpers from "./helper";

let parent: HTMLDivElement;
let blocker: HTMLDivElement;

const block = (url: string, settings: BlockerSettings) => {
  const sectionsToBlock = parseUrl(url, settings, NEW_SECTIONS);
  sectionsToBlock.forEach((section) => {
    if (isUserProfile()) {
      Helpers.hideBlockerElement(blocker);
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

      section.show ? Helpers.showElement(section) : Helpers.hideElement(section);
    });

    useFullPageBlocker ? Helpers.showBlockerElement(blocker, blockMessage) : Helpers.hideBlockerElement(blocker);
  });
};
const onload = (url: string, settings: BlockerSettings) => {
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

  parent = document.querySelector("header")?.parentElement as HTMLDivElement;

  blocker = blockerElement;

  block(url, settings);
};

const NewBlocker: Blocker = {
  block,
  onload,
};

export default NewBlocker;
