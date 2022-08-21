import React from "react";
import Options from "./Options";
import Option from "./Option";
import { useState, useEffect } from "react";
import { getSettings, toggleOption, BlockTypes } from "../../../chrome/storage";
import { sendSettingsResetMessage } from "../../../chrome/settingsHelper";

interface Props {
  show: boolean;
}

const GeneralOptions = ({ show }: Props) => {
  useEffect(() => {
    getSettings().then((settings) => {
      let blocks = settings.blocks;
      setMainFeed(blocks.mainFeed);
      setHideAll(blocks.all);
      setUserFeed(blocks.userFeed);
      setSidebar(blocks.sidebar);
      setSearch(blocks.search);
      setComments(blocks.comments);
    });
  }, []);

  const genericToggle = (
    block: BlockTypes,
    current: boolean,
    setCurrent: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    return () => {
      sendSettingsResetMessage();
      toggleOption(block);
      setCurrent(!current);
    };
  };

  const [mainFeed, setMainFeed] = useState(false);
  const toggleMainFeed = genericToggle(
    BlockTypes.MAIN_FEED,
    mainFeed,
    setMainFeed,
  );

  const [hideAll, setHideAll] = useState(false);
  const toggleHideAll = genericToggle(BlockTypes.ALL, hideAll, setHideAll);

  const [userFeed, setUserFeed] = useState(false);
  const toggleUserFeed = genericToggle(
    BlockTypes.USER_FEED,
    userFeed,
    setUserFeed,
  );

  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = genericToggle(BlockTypes.SIDEBAR, sidebar, setSidebar);

  const [search, setSearch] = useState(false);
  const toggleSearch = genericToggle(BlockTypes.SEARCH, search, setSearch);

  const [comments, setComments] = useState(false);
  const toggleComments = genericToggle(
    BlockTypes.COMMENTS,
    comments,
    setComments,
  );

  if (!show) return null;

  document.title = "DFReddit - General";
  return (
    <Options>
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
        title={"Hide User Feeds"}
        description={"Hides feed shown when you click onto a user's profile"}
        toggled={userFeed}
        setToggled={toggleUserFeed}
      />
      <Option
        title={"Hide Sidebar Tab"}
        description={"Hides the sidebar on the side of the homepage"}
        toggled={sidebar}
        setToggled={toggleSidebar}
      />
      <Option
        title={"Hide Full Search Results"}
        description={
          "Hides full page results after searching and pressing enter"
        }
        toggled={search}
        setToggled={toggleSearch}
      />
      <Option
        title={"Hide Comments"}
        description={"Hides all comments under posts"}
        toggled={comments}
        setToggled={toggleComments}
      />
    </Options>
  );
};

export default GeneralOptions;
