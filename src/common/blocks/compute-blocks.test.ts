import { describe, expect, it } from "vitest";
import { BlockMode, BlockerSettings, Blocks } from "../settings-config";
import { ATTRIBUTES, MESSAGES, computeBlocks } from "./compute-blocks";
import { PageType, classifyPage } from "../util/url-parser";

const HOMEPAGE_URL = "https://www.reddit.com/";
const NOTIFICATIONS_URL = "https://www.reddit.com/notifications";
const SEARCH_URL = "https://www.reddit.com/search/?q=cats";
const POPULAR_URL = "https://www.reddit.com/r/popular/";
const ALL_URL = "https://www.reddit.com/r/all/";
const SUBREDDIT_URL = "https://www.reddit.com/r/programming/";
const POST_URL = "https://www.reddit.com/r/programming/comments/abc123/some_post/";
const USER_PROFILE_URL = "https://www.reddit.com/user/spez/";
const SETTINGS_PAGE_URL = "https://www.reddit.com/settings/account";

const allBlocksDisabled: Blocks = {
  mainFeed: false,
  search: false,
  sidebar: false,
  userFeed: false,
  notifications: false,
  all: false,
  comments: false,
  subFeed: false,
  redditLogo: false,
  trendingNews: false,
  videos: false,
};

type SettingsOverrides = Partial<Omit<BlockerSettings, "blocks">> & { blocks?: Partial<Blocks> };

const createSettings = (overrides: SettingsOverrides = {}): BlockerSettings => ({
  enabled: true,
  mode: BlockMode.BLOCK,
  whitelist: [],
  blacklist: [],
  ...overrides,
  blocks: { ...allBlocksDisabled, ...overrides.blocks },
});

describe("classifyPage", () => {
  it("identifies the homepage including sort and query string variants", () => {
    expect(classifyPage(HOMEPAGE_URL).type).toBe(PageType.HOMEPAGE);
    expect(classifyPage("https://www.reddit.com").type).toBe(PageType.HOMEPAGE);
    expect(classifyPage("https://www.reddit.com/best/").type).toBe(PageType.HOMEPAGE);
    expect(classifyPage("https://www.reddit.com/?feed=home").type).toBe(PageType.HOMEPAGE);
  });

  it("identifies subreddit pages with and without a trailing slash", () => {
    expect(classifyPage(SUBREDDIT_URL)).toEqual({ type: PageType.SUBREDDIT, subreddit: "programming" });
    expect(classifyPage("https://www.reddit.com/r/programming")).toEqual({
      type: PageType.SUBREDDIT,
      subreddit: "programming",
    });
  });

  it("identifies r/all and r/popular as ALL_POPULAR rather than regular subreddits", () => {
    expect(classifyPage(ALL_URL).type).toBe(PageType.ALL_POPULAR);
    expect(classifyPage(POPULAR_URL).type).toBe(PageType.ALL_POPULAR);
    expect(classifyPage("https://www.reddit.com/r/popular").type).toBe(PageType.ALL_POPULAR);
  });

  it("extracts the subreddit from post pages", () => {
    expect(classifyPage(POST_URL)).toEqual({ type: PageType.POST, subreddit: "programming" });
  });

  it("extracts the username from user profile pages", () => {
    expect(classifyPage(USER_PROFILE_URL)).toEqual({ type: PageType.USER_PROFILE, username: "spez" });
  });

  it("classifies unrecognised reddit pages as OTHER", () => {
    expect(classifyPage(SETTINGS_PAGE_URL).type).toBe(PageType.OTHER);
  });

  it("recognises all supported subdomains", () => {
    expect(classifyPage("https://new.reddit.com/r/programming/").type).toBe(PageType.SUBREDDIT);
    expect(classifyPage("https://old.reddit.com/r/programming/").type).toBe(PageType.SUBREDDIT);
  });
});

describe("computeBlocks", () => {
  describe("when the extension is disabled", () => {
    it("returns no attributes and no overlay", () => {
      const settings = createSettings({ enabled: false, blocks: { mainFeed: true, sidebar: true } });

      expect(computeBlocks(HOMEPAGE_URL, settings)).toEqual({ attributes: [], overlayMessage: null });
    });
  });

  describe("blocks that apply on every page", () => {
    it("always hides ads while enabled", () => {
      const decision = computeBlocks(SETTINGS_PAGE_URL, createSettings());

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_ADS);
    });

    it("hides the sidebar, notifications icon, logo and videos on any page when enabled", () => {
      const settings = createSettings({
        blocks: { sidebar: true, notifications: true, redditLogo: true, videos: true },
      });

      const decision = computeBlocks(SETTINGS_PAGE_URL, settings);

      expect(decision.attributes).toEqual(
        expect.arrayContaining([
          ATTRIBUTES.HIDE_SIDEBAR,
          ATTRIBUTES.HIDE_NOTIFICATIONS,
          ATTRIBUTES.HIDE_LOGO,
          ATTRIBUTES.HIDE_VIDEOS,
        ])
      );
      expect(decision.overlayMessage).toBeNull();
    });
  });

  describe("on the homepage", () => {
    it("blocks the main feed with an overlay when the main feed block is enabled", () => {
      const decision = computeBlocks(HOMEPAGE_URL, createSettings({ blocks: { mainFeed: true } }));

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_MAIN_FEED);
      expect(decision.overlayMessage).toBe(MESSAGES.MAIN_FEED);
    });

    it("leaves the main feed visible when the main feed block is disabled", () => {
      const decision = computeBlocks(HOMEPAGE_URL, createSettings());

      expect(decision.attributes).not.toContain(ATTRIBUTES.HIDE_MAIN_FEED);
      expect(decision.overlayMessage).toBeNull();
    });
  });

  describe("on the notifications page", () => {
    it("shows the overlay when notifications are blocked", () => {
      const decision = computeBlocks(NOTIFICATIONS_URL, createSettings({ blocks: { notifications: true } }));

      expect(decision.overlayMessage).toBe(MESSAGES.NOTIFICATIONS);
    });
  });

  describe("on the search results page", () => {
    it("blocks search results with an overlay when the search block is enabled", () => {
      const decision = computeBlocks(SEARCH_URL, createSettings({ blocks: { search: true } }));

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_SEARCH);
      expect(decision.overlayMessage).toBe(MESSAGES.SEARCH);
    });
  });

  describe("on r/all and r/popular", () => {
    it("blocks the feed with an overlay when the all/popular block is enabled", () => {
      const decision = computeBlocks(POPULAR_URL, createSettings({ blocks: { all: true } }));

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_POPULAR);
      expect(decision.overlayMessage).toBe(MESSAGES.ALL_POPULAR);
    });

    it("does not treat r/all as a regular subreddit subject to whitelist mode", () => {
      const settings = createSettings({ mode: BlockMode.WHITELIST, whitelist: ["programming"] });

      const decision = computeBlocks(ALL_URL, settings);

      expect(decision.overlayMessage).toBeNull();
    });
  });

  describe("on a subreddit page", () => {
    it("does not block in standard mode when the sub feed block is disabled", () => {
      const decision = computeBlocks(SUBREDDIT_URL, createSettings());

      expect(decision.overlayMessage).toBeNull();
    });

    it("blocks every subreddit when the sub feed block is enabled", () => {
      const decision = computeBlocks(SUBREDDIT_URL, createSettings({ blocks: { subFeed: true } }));

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_SUB_FEED);
      expect(decision.overlayMessage).toBe(MESSAGES.SUB_FEED);
    });

    it("blocks a blacklisted subreddit in blacklist mode", () => {
      const settings = createSettings({ mode: BlockMode.BLACKLIST, blacklist: ["programming"] });

      const decision = computeBlocks(SUBREDDIT_URL, settings);

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_SUB_FEED);
      expect(decision.overlayMessage).toBe(MESSAGES.blacklisted("programming"));
    });

    it("allows a subreddit that is not blacklisted in blacklist mode", () => {
      const settings = createSettings({ mode: BlockMode.BLACKLIST, blacklist: ["gaming"] });

      expect(computeBlocks(SUBREDDIT_URL, settings).overlayMessage).toBeNull();
    });

    it("blocks a subreddit missing from the whitelist in whitelist mode", () => {
      const settings = createSettings({ mode: BlockMode.WHITELIST, whitelist: ["gaming"] });

      const decision = computeBlocks(SUBREDDIT_URL, settings);

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_SUB_FEED);
      expect(decision.overlayMessage).toBe(MESSAGES.notWhitelisted("programming"));
    });

    it("allows a whitelisted subreddit in whitelist mode", () => {
      const settings = createSettings({ mode: BlockMode.WHITELIST, whitelist: ["programming"] });

      expect(computeBlocks(SUBREDDIT_URL, settings).overlayMessage).toBeNull();
    });

    it("matches list entries case-insensitively", () => {
      const settings = createSettings({ mode: BlockMode.BLACKLIST, blacklist: ["Programming"] });

      expect(computeBlocks(SUBREDDIT_URL, settings).overlayMessage).toBe(MESSAGES.blacklisted("programming"));
    });

    it("prefers the blanket sub feed message over the list-based message", () => {
      const settings = createSettings({
        mode: BlockMode.BLACKLIST,
        blacklist: ["programming"],
        blocks: { subFeed: true },
      });

      expect(computeBlocks(SUBREDDIT_URL, settings).overlayMessage).toBe(MESSAGES.SUB_FEED);
    });
  });

  describe("on a post page", () => {
    it("blocks the post and sidebar with an overlay when its subreddit is blacklisted", () => {
      const settings = createSettings({ mode: BlockMode.BLACKLIST, blacklist: ["programming"] });

      const decision = computeBlocks(POST_URL, settings);

      expect(decision.attributes).toEqual(expect.arrayContaining([ATTRIBUTES.HIDE_POST, ATTRIBUTES.HIDE_SIDEBAR]));
      expect(decision.overlayMessage).toBe(MESSAGES.blacklisted("programming"));
    });

    it("allows the post but hides comments when the comments block is enabled", () => {
      const decision = computeBlocks(POST_URL, createSettings({ blocks: { comments: true } }));

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_COMMENTS);
      expect(decision.attributes).not.toContain(ATTRIBUTES.HIDE_POST);
      expect(decision.overlayMessage).toBeNull();
    });

    it("allows a post from a whitelisted subreddit in whitelist mode", () => {
      const settings = createSettings({ mode: BlockMode.WHITELIST, whitelist: ["programming"] });

      expect(computeBlocks(POST_URL, settings).overlayMessage).toBeNull();
    });
  });

  describe("on a user profile page", () => {
    it("blocks the profile with an overlay when the user feed block is enabled", () => {
      const decision = computeBlocks(USER_PROFILE_URL, createSettings({ blocks: { userFeed: true } }));

      expect(decision.attributes).toContain(ATTRIBUTES.HIDE_USER_FEED);
      expect(decision.overlayMessage).toBe(MESSAGES.USER_PROFILES);
    });

    it("does not block the logged-in user's own profile", () => {
      const settings = createSettings({ blocks: { userFeed: true } });

      const decision = computeBlocks(USER_PROFILE_URL, settings, { isOwnProfile: true });

      expect(decision.attributes).not.toContain(ATTRIBUTES.HIDE_USER_FEED);
      expect(decision.overlayMessage).toBeNull();
    });

    it("does not block profiles when the user feed block is disabled", () => {
      expect(computeBlocks(USER_PROFILE_URL, createSettings()).overlayMessage).toBeNull();
    });
  });
});
