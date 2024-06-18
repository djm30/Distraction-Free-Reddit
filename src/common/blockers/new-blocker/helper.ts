const isDarkMode = () => {
  return document.documentElement.classList.contains("theme-dark");
};

const isUserProfile = (urlUsername: string) => {
  const matchingCookie = document.cookie.split(";").find((cookie) => cookie.includes("recentclicks"));
  if (!matchingCookie || matchingCookie.length < 1) return false;
  return matchingCookie[0] === urlUsername;
};

const createBlocker = (): HTMLDivElement => {
  const darkModeOn = isDarkMode();
  const fontColor = darkModeOn ? "white" : "black";
  const bgColor = darkModeOn ? "#030303" : "#DAE0E6";

  // Creating blocker element
  const blockerStyles = `position: fixed; top: 48px;
                        width: 100%; height: 100vh; z-index: 79;
                        background: ${bgColor}; text-align: center;
                        font-size: 20px; color: ${fontColor}; padding-top: 40px;`;
  const blocker = document.createElement("div");
  blocker.id = "blocker";
  blocker.style.cssText = blockerStyles;

  blocker.innerText = "Distraction Free Reddit is loading...";
  return blocker;
};

export { isUserProfile, createBlocker };
