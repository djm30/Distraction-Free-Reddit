const BASE_URL_PATTERN = /^https?:\/\/(www|new|old)\.reddit\.com/;

const buildRegex = (path: string) => new RegExp(`${BASE_URL_PATTERN.source}${path}`);

/**
 * Matches whatever follows a subreddit name: a sort (/new, /top/), a query
 * string, a fragment, or nothing. Anchoring on [/?#] rather than just "/" keeps
 * the captured name clean, so r/france, r/france/new and r/france/top/?t=week
 * all classify as the same subreddit.
 */
const TRAILING_PATH = "(?:[/?#].*)?$";

export const REGEXES = {
  HOMEPAGE: buildRegex("/?(best|hot|new|top/.*|\\?[a-zA-Z0-9_=&]*)?/?$"),
  NOTIFICATIONS: buildRegex("/notifications.*"),
  SEARCH: buildRegex("/search/?\\?q=.*"),
  ALL_POPULAR: buildRegex(`/r/(all|popular)${TRAILING_PATH}`),
  EXPLORE: buildRegex(`/explore${TRAILING_PATH}`),
  USER_PROFILE: buildRegex("/user/([^/?#]+)"),
  SUBREDDIT: buildRegex(`/r/([^/?#]+)${TRAILING_PATH}`),
  POST: buildRegex("/r/([^/?#]+)/comments/.*"),
};

export enum PageType {
  HOMEPAGE,
  NOTIFICATIONS,
  SEARCH,
  ALL_POPULAR,
  EXPLORE,
  USER_PROFILE,
  SUBREDDIT,
  POST,
  OTHER,
}

export interface PageInfo {
  type: PageType;
  /** Set for SUBREDDIT and POST pages */
  subreddit?: string;
  /** Set for USER_PROFILE pages */
  username?: string;
}

// Capture group 1 of every regex is the subdomain, so page-specific captures start at group 2
const PAGE_CAPTURE_GROUP = 2;

export const classifyPage = (url: string): PageInfo => {
  if (REGEXES.HOMEPAGE.test(url)) return { type: PageType.HOMEPAGE };
  if (REGEXES.NOTIFICATIONS.test(url)) return { type: PageType.NOTIFICATIONS };
  if (REGEXES.SEARCH.test(url)) return { type: PageType.SEARCH };
  if (REGEXES.ALL_POPULAR.test(url)) return { type: PageType.ALL_POPULAR };
  if (REGEXES.EXPLORE.test(url)) return { type: PageType.EXPLORE };

  const userMatch = url.match(REGEXES.USER_PROFILE);
  if (userMatch) return { type: PageType.USER_PROFILE, username: userMatch[PAGE_CAPTURE_GROUP] };

  const postMatch = url.match(REGEXES.POST);
  if (postMatch) return { type: PageType.POST, subreddit: postMatch[PAGE_CAPTURE_GROUP] };

  const subredditMatch = url.match(REGEXES.SUBREDDIT);
  if (subredditMatch) return { type: PageType.SUBREDDIT, subreddit: subredditMatch[PAGE_CAPTURE_GROUP] };

  return { type: PageType.OTHER };
};
