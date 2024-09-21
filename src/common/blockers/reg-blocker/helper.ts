import { RedditSecBlockConfig, CustomBlock } from "../../types";
import DOMController from "../../util/dom-controller";

const isDarkMode = () => {
  const htmlElement = document.querySelector("html");
  return htmlElement?.classList.contains("theme-dark");
};

const isUserProfile = (urlUsername: string) => {
  const userProfileLink: HTMLAnchorElement | null | undefined = document
    .querySelector("faceplate-tracker[noun=profile]")
    ?.querySelector("a");

  if (!userProfileLink) {
    return false;
  }

  const hrefSplit = userProfileLink.href.split("/");
  const username = hrefSplit[hrefSplit.length - 2];
  return urlUsername === username;
};

const createBlocker = (): HTMLDivElement => {
  const darkModeOn = isDarkMode();
  const fontColor = darkModeOn ? "#F2F4F5" : "#0F1A1C";
  const bgColor = darkModeOn ? "#0B1416" : "#FFFFFF";
  // Creating blocker element
  const blockerStyles = `position: fixed; top: 57px;
                        width: 100%; height: 100vh; z-index: 1;
                        background: ${bgColor}; text-align: center;
                        font-size: 20px; color: ${fontColor}; padding-top: 40px; display:none`;
  const blocker = document.createElement("div");
  blocker.id = "blocker";
  blocker.style.cssText = blockerStyles;

  // We are going to hide the blocker element by default, it will then be hidden when needed
  blocker.innerText = "Distraction Free Reddit is loading...";
  return blocker;
};

const showAll = (currentlyBlocked: RedditSecBlockConfig[], blocker: HTMLDivElement) => {
  DOMController.hideBlockerElement(blocker);
  currentlyBlocked.forEach((section) => {
    DOMController.showElement(section);
  });
};

export { createBlocker, isUserProfile, showAll };
