import logger from "./logger";

// Finds out whether the site is running in dark mode or not
export const isDarkMode = () => {
  let darkMode = false;
  let element = document.querySelector("._1VP69d9lk-Wk9zokOaylL") as HTMLElement;
  element.style.cssText.split(" ").forEach((style) => {
    if (style.startsWith("--background:")) {
      let bodyColor = style.split("#")[1];
      darkMode = bodyColor !== "FFFFFF;";
    }
  });
  return darkMode;
};

// Check if the current url is a user profile
export const isUserProfile = () => {
  const selector = "._2BMnTatQ5gjKGK5OWROgaG";

  const userProfileElement = document.querySelector(selector);

  const userUrlRegex = /^https:\/\/www.reddit.com\/user\/([^\/]*)\/?(.*)/;
  const match = userUrlRegex.exec(document.URL);

  if (match && userProfileElement) return userProfileElement.textContent === match[1];

  return false;
};
