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
  removeBlacklist,
} from "../../../chrome/storage";
import { tab } from "../tabs";
import { sendSettingsResetMessage } from "../../../chrome/settingsHelper";

interface Props {
  show: boolean;
  menuTab: tab;
}

const Blacklist = ({ show, menuTab }: Props) => {
  const [toggled, setToggled] = useState(false);
  const [blacklist, setBlacklist] = useState<Array<string>>([]);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.mode === Mode.BLACKLIST) setToggled(true);
      else setToggled(false);
      setBlacklist(settings.blacklist);
    });
  }, [menuTab]);

  const blacklistToggle = () => {
    toggled ? setMode(Mode.BLOCK) : setMode(Mode.BLACKLIST);
    setToggled(!toggled);
    sendSettingsResetMessage();
  };

  const addSubreddit = (subreddit: string) => {
    pushBlacklist(subreddit);
    setBlacklist(blacklist.concat(subreddit));
    sendSettingsResetMessage();
  };

  const removeSubreddit = (subreddit: string) => {
    removeBlacklist(subreddit);
    setBlacklist(blacklist.filter((sub) => sub !== subreddit));
    sendSettingsResetMessage();
  };

  if (!show) return null;

  document.title = "DFReddit - Blacklist";
  return (
    <Options>
      <Option
        title={"Enable Blacklist Mode"}
        description={"Block access to certain subreddits you choose"}
        toggled={toggled}
        setToggled={blacklistToggle}
      />
      <SubredditList
        subreddits={blacklist}
        addSubreddit={addSubreddit}
        removeSubreddit={removeSubreddit}
      />
    </Options>
  );
};

export default Blacklist;
