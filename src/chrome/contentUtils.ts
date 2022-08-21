export const isDarkMode = () => {
    let darkMode = false;
    let element = document.querySelector("._1VP69d9lk-Wk9zokOaylL") as HTMLElement;
    element.style.cssText.split(" ").forEach(style => {
        console.log(style);
        if (style.startsWith("--background:")) {
            let bodyColor = style.split("#")[1];
            darkMode = bodyColor !== "FFFFFF;"
        }
    })
    return darkMode;
}

// Check if users profile
export const isUserProfile = () => {
    let isUserProf = false;

    const userUrlRegex = /^https:\/\/www.reddit.com\/user\/([^\/]*)\/?((submitted|comments))?\/?/
    const userName = (document.cookie as string).split(";")?.find((cookie) => cookie.includes("_recentclicks"))?.split("_")[0];
    if (userName && userUrlRegex.test(document.URL)) {
        const urlUserName = document.URL.match(userUrlRegex)![1];
        console.log({ urlUserName })
        if (userName.trim() === urlUserName.trim()) {
            isUserProf = true;
        }
    }

    console.log({ userName });

    return isUserProf;
}