import React from "react";
import Options from "./Options";
import Option from "./Option";
import { useState, useEffect } from "react";
import storageFunctions, { toggleOption } from "../../../common/storage-service";
import { BlockTypes } from "../../../common/settings-config";

interface Props {
  show: boolean;
}

const GeneralOptions = ({ show }: Props) => {
  // Your existing state and functions...
  useEffect(() => {
    storageFunctions.getSettings().then((settings) => {
      let blocks = settings.blocks;
      setMainFeed(blocks.mainFeed);
      setHideAll(blocks.all);
      setSubFeed(blocks.subFeed);
      setUserFeed(blocks.userFeed);
      setSidebar(blocks.sidebar);
      setSearch(blocks.search);
      setComments(blocks.comments);
      setNotifications(blocks.notifications);
      setRedditLogo(blocks.redditLogo);
      setTrendingNews(blocks.trendingNews);
      setVideos(blocks.videos);
    });
  }, []);

  const genericToggle = (
    block: BlockTypes,
    current: boolean,
    setCurrent: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return async () => {
      await toggleOption(block);
      setCurrent(!current);
      storageFunctions.sendSettingsResetMessage();
    };
  };

  const [mainFeed, setMainFeed] = useState(false);
  const toggleMainFeed = genericToggle(BlockTypes.MAIN_FEED, mainFeed, setMainFeed);

  const [hideAll, setHideAll] = useState(false);
  const toggleHideAll = genericToggle(BlockTypes.ALL, hideAll, setHideAll);

  const [subFeed, setSubFeed] = useState(false);
  const toggleSubFeed = genericToggle(BlockTypes.SUB_FEED, subFeed, setSubFeed);

  const [comments, setComments] = useState(false);
  const toggleComments = genericToggle(BlockTypes.COMMENTS, comments, setComments);

  const [notifications, setNotifications] = useState(false);
  const toggleNotifications = genericToggle(BlockTypes.NOTIFICATIONS, notifications, setNotifications);

  const [userFeed, setUserFeed] = useState(false);
  const toggleUserFeed = genericToggle(BlockTypes.USER_FEED, userFeed, setUserFeed);

  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = genericToggle(BlockTypes.SIDEBAR, sidebar, setSidebar);

  const [redditLogo, setRedditLogo] = useState(false);
  const toggleRedditLogo = genericToggle(BlockTypes.REDDIT_LOGO, redditLogo, setRedditLogo);

  const [search, setSearch] = useState(false);
  const toggleSearch = genericToggle(BlockTypes.SEARCH, search, setSearch);

  const [trendingNews, setTrendingNews] = useState(false);
  const toggleTrendingNews = genericToggle(BlockTypes.TRENDING_NEWS, trendingNews, setTrendingNews);

  const [videos, setVideos] = useState(false);
  const toggleVideos = genericToggle(BlockTypes.VIDEOS, videos, setVideos);

  if (!show) return null;

  document.title = "DFReddit - General";

  return (
    <Options>
      <div className="space-y-3 divide-y divide-gray-800">
        <Option
          title={"Hide Main Feed"}
          description={"Hides the main feed on the homepage"}
          toggled={mainFeed}
          setToggled={toggleMainFeed}
        />
        <Option
          title={"Hide r/All and r/Popular"}
          description={"Hides both r/All and r/Popular"}
          toggled={hideAll}
          setToggled={toggleHideAll}
        />
        <Option
          title={"Hide Subreddit feeds"}
          description={"Only single posts from a search engine are viewable"}
          toggled={subFeed}
          setToggled={toggleSubFeed}
        />
        <Option
          title={"Hide Comments"}
          description={"Hides all comments under posts"}
          toggled={comments}
          setToggled={toggleComments}
        />
        <Option
          title={"Hide Notifications"}
          description={"Hides notification popup and notifications page"}
          toggled={notifications}
          setToggled={toggleNotifications}
        />
        <Option
          title={"Hide User Feeds"}
          description={"Hides feed shown when you click onto a user's profile"}
          toggled={userFeed}
          setToggled={toggleUserFeed}
        />
        <Option
          title={"Hide Sidebar Tab"}
          description={"Hides the sidebar on the homepage and sub feeds"}
          toggled={sidebar}
          setToggled={toggleSidebar}
        />
        <Option
          title={"Hide Reddit Logo"}
          description={"Hides large Reddit logo in the header of the page"}
          toggled={redditLogo}
          setToggled={toggleRedditLogo}
        />
        <Option
          title={"Hide Full Search Results"}
          description={"Hides full page results after searching and pressing enter"}
          toggled={search}
          setToggled={toggleSearch}
        />
        <Option
          title={"Hide Trending News"}
          description={"Hides trending news when searching"}
          toggled={trendingNews}
          setToggled={toggleTrendingNews}
        />
        <Option
          title={"Hide Videos"}
          description={"Hides videos and gifs, except from subreddits in Whitelist"}
          toggled={videos}
          setToggled={toggleVideos}
        />
      </div>
    </Options>
  );
};

export default GeneralOptions;
