export enum Mode {
    BLOCK,
    WHITELIST,
    BLACKLIST
}

export interface StorageShape {
    enabled: boolean,
    mode: Mode,
    whitelist: Array<string>,
    blacklist: Array<string>,
    blocks: Blocks
}

export interface Blocks {
    mainFeed: boolean,
    search: boolean,
    sidebar: boolean,
    userFeed: boolean,
    all: boolean,
    comments: boolean
}

export enum BlockTypes {
    MAIN_FEED,
    USER_FEED,
    ALL,
    COMMENTS,
    SIDEBAR,
    SEARCH
}

let defaultSettings: StorageShape = {
    enabled: true,
    mode: Mode.BLOCK,
    whitelist: [],
    blacklist: [],
    blocks: {
        mainFeed: true,
        search: true,
        sidebar: true,
        userFeed: true,
        all: true,
        comments: true
    }
}

export const initializeSettings = async () => {
    chrome.storage.sync.get("options").then(val => {
        if (Object.keys(val).length === 0) {
            chrome.storage.sync.set({ "options": defaultSettings })
        }
    })
    console.log("Initialised settings!")
}

const parseMode = (int: Number): Mode => {
    switch (int) {
        case 0:
            return Mode.BLOCK;
        case 1:
            return Mode.WHITELIST;
        case 2:
            return Mode.BLACKLIST;
        default:
            return Mode.BLOCK;
    }
}

export const getSettings = async () => {
    const storage = await chrome.storage.sync.get("options");
    const settingsFromStore = storage.options;

    const mappedBlocks: Blocks = {
        all: settingsFromStore.blocks.all,
        comments: settingsFromStore.blocks.comments,
        mainFeed: settingsFromStore.blocks.mainFeed,
        sidebar: settingsFromStore.blocks.sidebar,
        search: settingsFromStore.blocks.search,
        userFeed: settingsFromStore.blocks.userFeed
    }

    const mappedSettings: StorageShape = {
        enabled: settingsFromStore.enabled,
        mode: parseMode(settingsFromStore.mode),
        blacklist: settingsFromStore.blacklist,
        whitelist: settingsFromStore.whitelist,
        blocks: mappedBlocks
    }
    return mappedSettings;
}

export const setMode = async (mode: Mode) => {
    const settings = await getSettings();
    settings.mode = mode;
    await chrome.storage.sync.set({ "options": settings })
}

export const pushBlacklist = async (subreddit: string) => {
    const settings = await getSettings();
    settings.blacklist.push(subreddit);
    await chrome.storage.sync.set({ "options": settings })
}

export const removeBlacklist = async (subreddit: string) => {
    const settings = await getSettings();
    settings.blacklist = settings.blacklist.filter(sub => sub !== subreddit)
    await chrome.storage.sync.set({ "options": settings })
}

export const pushWhitelist = async (subreddit: string) => {
    const settings = await getSettings();
    settings.whitelist.push(subreddit);
    await chrome.storage.sync.set({ "options": settings })
}

export const removeWhitelist = async (subreddit: string) => {
    const settings = await getSettings();
    settings.whitelist = settings.whitelist.filter(sub => sub !== subreddit)
    await chrome.storage.sync.set({ "options": settings })
}

export const toggleEnabled = async () => {
    const settings = await getSettings();
    settings.enabled = !settings.enabled;
    await chrome.storage.sync.set({ "options": settings })
}

export const toggleOption = async (option: BlockTypes) => {
    const settings = await getSettings();
    switch (option) {
        case BlockTypes.ALL:
            settings.blocks.all = !settings.blocks.all
            break;
        case BlockTypes.MAIN_FEED:
            settings.blocks.mainFeed = !settings.blocks.mainFeed
            break;
        case BlockTypes.USER_FEED:
            settings.blocks.userFeed = !settings.blocks.userFeed
            break;
        case BlockTypes.COMMENTS:
            settings.blocks.comments = !settings.blocks.comments
            break;
        case BlockTypes.SEARCH:
            settings.blocks.search = !settings.blocks.search
            break;
        case BlockTypes.SIDEBAR:
            settings.blocks.sidebar = !settings.blocks.sidebar
            break;
    }
    await chrome.storage.sync.set({ "options": settings })
}

export const resetSettings = async () => {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({ "options": defaultSettings })
}