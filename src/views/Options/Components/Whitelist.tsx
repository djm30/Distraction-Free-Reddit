import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";
import { useState, useEffect } from "react";
import {
  getSettings,
  setMode,
  Mode,
  pushWhitelist,
} from "../../../chrome/storage";

const Whitelist = () => {
  const [toggled, setToggled] = useState(false);
  const [whitelist, setWhitelist] = useState<Array<string>>([]);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.mode === Mode.WHITELIST) setToggled(true);
      setWhitelist(settings.whitelist);
    });
  }, []);

  const whitelistToggle = () => {
    toggled ? setMode(Mode.BLOCK) : setMode(Mode.WHITELIST);
    setToggled(!toggled);
  };

  const addSubreddit = (subreddit: string) => {
    pushWhitelist(subreddit);
    setWhitelist(whitelist.concat(subreddit));
  };

  document.title = "DFReddit - Whitelist";
  return (
    <Options>
      <Option
        title={"Enable Whitelist Mode"}
        description={"Allow access only to the subreddits you choose"}
        toggled={toggled}
        setToggled={whitelistToggle}
      />
      <SubredditList subreddits={whitelist} addSubreddit={addSubreddit} />
    </Options>
  );
};

export default Whitelist;
