export enum BlockMode {
  BLOCK,
  WHITELIST,
  BLACKLIST,
}

export interface BlockerSettings {
  enabled: boolean;
  mode: BlockMode;
  whitelist: Array<string>;
  blacklist: Array<string>;
  blocks: Blocks;
}

export interface Blocks {
  mainFeed: boolean;
  search: boolean;
  sidebar: boolean;
  userFeed: boolean;
  notifications: boolean;
  all: boolean;
  comments: boolean;
  subFeed: boolean;
  redditLogo: boolean;
  trendingNews: boolean;
  videos: boolean;
}

export enum BlockTypes {
  MAIN_FEED,
  USER_FEED,
  ALL,
  COMMENTS,
  NOTIFICATIONS,
  SIDEBAR,
  SEARCH,
  SUB_FEED,
  REDDIT_LOGO,
  TRENDING_NEWS,
  VIDEOS,
}

export interface StorageFunctions {
  getSettings: () => Promise<BlockerSettings>;
  setSettings: (settings: BlockerSettings) => Promise<void>;
  resetSettings: () => Promise<void>;
  initializeSettings: () => Promise<void>;
  onSettingsChanged: (callback: (settings: BlockerSettings) => void) => void;
}

export const defaultSettings: BlockerSettings = {
  enabled: true,
  mode: BlockMode.BLOCK,
  whitelist: [],
  blacklist: [],
  blocks: {
    mainFeed: true,
    search: true,
    sidebar: true,
    notifications: true,
    userFeed: true,
    all: true,
    comments: true,
    subFeed: true,
    redditLogo: true,
    trendingNews: true,
    videos: true,
  },
};

/**
 * Maps raw stored settings into a well-formed BlockerSettings, falling back to
 * defaults for anything missing (e.g. block options added after the user's
 * settings were last saved).
 */
export const parseStoredSettings = (stored: unknown): BlockerSettings => {
  const cloneDefaults = (): BlockerSettings => JSON.parse(JSON.stringify(defaultSettings));

  if (!stored) return cloneDefaults();

  const settings = stored as Partial<BlockerSettings>;
  return {
    enabled: settings.enabled ?? defaultSettings.enabled,
    mode: parseMode(settings.mode ?? defaultSettings.mode),
    whitelist: settings.whitelist ?? [],
    blacklist: settings.blacklist ?? [],
    blocks: { ...cloneDefaults().blocks, ...settings.blocks },
  };
};

export const parseMode = (int: Number): BlockMode => {
  switch (int) {
    case 0:
      return BlockMode.BLOCK;
    case 1:
      return BlockMode.WHITELIST;
    case 2:
      return BlockMode.BLACKLIST;
    default:
      return BlockMode.BLOCK;
  }
};
