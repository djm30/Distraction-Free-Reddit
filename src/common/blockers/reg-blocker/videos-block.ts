import { SpecializedBlocker } from "../../types";
import { BlockerSettings } from "../../settings-config";

let localSettings: BlockerSettings;

const RETRY_INTERVAL_MS = 25;
const MAX_RETRY_DURATION_MS = 500;

const startRetryingRemoval = () => setInterval(removeVideosPosts, RETRY_INTERVAL_MS)

const stopRetryingAfterTimeout = (retryInterval: ReturnType<typeof setInterval>) => {
    return setTimeout(() => {
        clearInterval(retryInterval);
    }, MAX_RETRY_DURATION_MS);
};

const removeVideosPosts = () => {
    if (!localSettings.blocks.videos) return;

    document.querySelectorAll('shreddit-post[content-href*="redgifs.com"]')
        .forEach(post => post.remove())
};

const setupMutationObserver = () => {
    const observer = new MutationObserver(removeVideosPosts);
    observer.observe(document.body, { childList: true, subtree: true });
};

const initialiseVideosBlocker = (settings: BlockerSettings) => {
    localSettings = settings;

    removeVideosPosts();
    const retryInterval = startRetryingRemoval();
    stopRetryingAfterTimeout(retryInterval);

    setupMutationObserver();
};

const blockVideos = (settings: BlockerSettings) => {
    localSettings = settings;
    removeVideosPosts();
};

const VideoBlocker: SpecializedBlocker = {
    initialise: initialiseVideosBlocker,
    block: blockVideos,
};

export default VideoBlocker
