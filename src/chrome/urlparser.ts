import { Mode, StorageShape } from "./storage";
import { BlockSection, sections } from "./cssclassnames";
import { Message, MessageType } from "./messages";

// Gets a list of classnames that need to be removed from a current url based on current setttings passed to it
export const parseUrl = (
    url: string,
    settings: StorageShape,
): BlockSection[] => {
    let sections: BlockSection[] = [];

    // Is url on the homepage
    if (/^https:\/\/www.reddit.com\/(best\/|hot\/|new\/|top\/.*)*$/.test(url)) {
        sections.push(...homepageSettings(settings));
    }

    // If url is the serch page
    else if (/^https:\/\/www.reddit.com\/search\/\?q=.*/.test(url))
        sections.push(searchPageSettings(settings));
    // If url is r/All
    else if (/^https:\/\/www.reddit.com\/r\/(all|popular)\/.*$/.test(url))
        sections.push(allPopularSettings(settings));
    // If url is a users profile
    else if (
        /^https:\/\/www.reddit.com\/user\/([^\/]*)\/?((submitted|comments))?\/?/.test(
            url,
        )
    )
        sections.push(userFeedSettings(settings));
    // If url is a subreddit
    else if (/^https:\/\/www.reddit.com\/r\/([^\/]+)*\/$/.test(url)) {
        const subreddit = url.match(
            /^https:\/\/www.reddit.com\/r\/([^\/]+)*/,
        )![1];

        sections.push(subredditSettings(settings, subreddit as string));
    }

    // If url is a post
    else if (/^https:\/\/www.reddit.com\/r\/(.*)\/comments\/.*/.test(url)) {
        console.log("we posting");
        const subreddit = url.match(
            /^https:\/\/www.reddit.com\/r\/([^\/]+)*/,
        )![1];
        sections.push(...postSettings(settings, subreddit as string));
    }

    return sections;
};
// Gets classes based on current homepage settings
const homepageSettings = (settings: StorageShape) => {
    const mainFeedSection: BlockSection = { ...sections.mainFeed };
    const sideBarSection: BlockSection = { ...sections.sideBar };
    if (settings.blocks.mainFeed) {
        mainFeedSection.show = false;
        mainFeedSection.useBlocker = true;
        mainFeedSection.blockMsg = "You have blocked the main feed";
        sideBarSection.useBlocker = true;
        sideBarSection.blockMsg = "You have blocked the main feed";
    }
    if (settings.blocks.sidebar) {
        sideBarSection.show = false;
    }

    return [mainFeedSection, sideBarSection];
};

const searchPageSettings = (settings: StorageShape) => {
    const searchFeedSection: BlockSection = { ...sections.search };
    if (settings.blocks.search) {
        searchFeedSection.show = false;
        searchFeedSection.useBlocker = true;
        searchFeedSection.blockMsg = "Search Results have been blocked";
    }
    return searchFeedSection;
};

const allPopularSettings = (settings: StorageShape) => {
    const allSection: BlockSection = { ...sections.popular };
    if (settings.blocks.all) {
        allSection.show = false;
        allSection.useBlocker = true;
        allSection.blockMsg = "You have blocked access to r/All and r/Popular";
    }
    return allSection;
};

// TODO
const subredditSettings = (settings: StorageShape, subreddit: string) => {
    const subFeedSection: BlockSection = { ...sections.subFeed };
    if (settings.mode === Mode.BLACKLIST) {
        if (settings.blacklist.includes(subreddit.toLowerCase())) {
            subFeedSection.show = false;
            subFeedSection.useBlocker = true;
            subFeedSection.blockMsg = `r/${subreddit} is on your blacklist`;
        }
    } else if (settings.mode === Mode.WHITELIST) {
        if (!settings.whitelist.includes(subreddit.toLowerCase())) {
            subFeedSection.show = false;
            subFeedSection.useBlocker = true;
            subFeedSection.blockMsg = `r/${subreddit} is not on your whitelist`;
        }
    }
    return subFeedSection;
};

const userFeedSettings = (settings: StorageShape) => {
    const userFeedSection: BlockSection = { ...sections.userFeed };
    if (settings.blocks.userFeed) {
        userFeedSection.show = false;
        userFeedSection.useBlocker = true;
        userFeedSection.blockMsg = "Access to user profiles has been blocked";
    }
    return userFeedSection;
};

const postSettings = (settings: StorageShape, subreddit: string) => {
    const postSettings: BlockSection = { ...sections.post };
    if (settings.mode === Mode.BLACKLIST) {
        if (settings.blacklist.includes(subreddit.toLowerCase())) {
            postSettings.show = false;
        }
    } else if (settings.mode === Mode.WHITELIST) {
        if (!settings.whitelist.includes(subreddit.toLowerCase())) {
            postSettings.show = false;
        }
    }
    const commentSettings: BlockSection = { ...sections.comments };
    if (settings.blocks.comments) {
        commentSettings.show = false;
    }

    return [postSettings, commentSettings];
};
