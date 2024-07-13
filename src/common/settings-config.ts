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
  all: boolean;
  comments: boolean;
  subFeed: boolean;
}

export enum BlockTypes {
  MAIN_FEED,
  USER_FEED,
  ALL,
  COMMENTS,
  SIDEBAR,
  SEARCH,
  SUB_FEED,
}

export interface StorageFunctions {
  getSettings: () => Promise<BlockerSettings>;
  setSettings: (settings: BlockerSettings) => Promise<void>;
  resetSettings: () => Promise<void>;
  initializeSettings: () => Promise<void>;
  sendSettingsResetMessage: () => Promise<void> | void;
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
    userFeed: true,
    all: true,
    comments: true,
    subFeed: true,
  },
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
