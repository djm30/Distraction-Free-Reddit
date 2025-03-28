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
    const removeIfNotInWhitelist = (post: Element) => {
        const subredditTag = post.querySelector('[subreddit-prefixed-name]');
        if (!subredditTag) {
            post.remove();
            return;
        }

        const subredditName = subredditTag.getAttribute('subreddit-prefixed-name');
        if (!subredditName || !localSettings.whitelist.includes(subredditName.replace('r/', ''))) {
            post.remove();
        }
    }

    const getRedgifs = () => {
        return document.querySelectorAll('shreddit-post[domain*="redgifs.com"]');
    };

    const getGifs = () => {
        return document.querySelectorAll('shreddit-post[post-type="gif"]');
    }

    const getVideos = () => {
        return document.querySelectorAll('shreddit-post[post-type="video"]')
    }

    if (!localSettings.blocks.videos) return;

    getRedgifs().forEach(post => removeIfNotInWhitelist(post));
    getGifs().forEach(post => removeIfNotInWhitelist(post));
    getVideos().forEach(post => removeIfNotInWhitelist(post));
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
