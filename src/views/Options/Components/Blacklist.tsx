import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";
import { useState, useEffect } from "react";
import {
  getSettings,
  setMode,
  Mode,
  pushBlacklist,
} from "../../../chrome/storage";

const Blacklist = () => {
  const [toggled, setToggled] = useState(false);
  const [blacklist, setBlacklist] = useState<Array<string>>([]);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.mode === Mode.BLACKLIST) setToggled(true);
      setBlacklist(settings.blacklist);
    });
  }, []);

  const blacklistToggle = () => {
    toggled ? setMode(Mode.BLOCK) : setMode(Mode.BLACKLIST);
    setToggled(!toggled);
  };

  const addSubreddit = (subreddit: string) => {
    pushBlacklist(subreddit);
    setBlacklist(blacklist.concat(subreddit));
  };

  document.title = "DFReddit - Blacklist";
  return (
    <Options>
      <Option
        title={"Enable Blacklist Mode"}
        description={"Block access to certain subreddits you choose"}
        toggled={toggled}
        setToggled={blacklistToggle}
      />
      <SubredditList subreddits={blacklist} addSubreddit={addSubreddit} />
    </Options>
  );
};

export default Blacklist;
