import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";
import { tab } from "../tabs";
import { useState, useEffect } from "react";
import {
  getSettings,
  setMode,
  Mode,
  pushWhitelist,
  removeWhitelist,
} from "../../../chrome/storage";
import { sendSettingsResetMessage } from "../../../chrome/settingsHelper";

interface Props {
  show: boolean;
  menuTab: tab;
}

const Whitelist = ({ show, menuTab }: Props) => {
  const [toggled, setToggled] = useState(false);
  const [whitelist, setWhitelist] = useState<Array<string>>([]);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.mode === Mode.WHITELIST) setToggled(true);
      else setToggled(false);
      setWhitelist(settings.whitelist);
    });
  }, [menuTab]);

  const whitelistToggle = () => {
    toggled ? setMode(Mode.BLOCK) : setMode(Mode.WHITELIST);
    setToggled(!toggled);
    sendSettingsResetMessage();
  };

  const addSubreddit = (subreddit: string) => {
    pushWhitelist(subreddit);
    setWhitelist(whitelist.concat(subreddit));
    sendSettingsResetMessage();
  };

  const removeSubreddit = (subreddit: string) => {
    removeWhitelist(subreddit);
    setWhitelist(whitelist.filter((sub) => sub !== subreddit));
    sendSettingsResetMessage();
  };

  if (!show) return null;

  document.title = "DFReddit - Whitelist";
  return (
    <Options>
      <Option
        title={"Enable Whitelist Mode"}
        description={"Allow access only to the subreddits you choose"}
        toggled={toggled}
        setToggled={whitelistToggle}
      />
      <SubredditList
        subreddits={whitelist}
        addSubreddit={addSubreddit}
        removeSubreddit={removeSubreddit}
      />
    </Options>
  );
};

export default Whitelist;
