import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";
import { useState, useEffect } from "react";
import storageFunctions, { setMode, pushBlacklist, removeBlacklist } from "../../../common/storage-service";
import { BlockMode } from "../../../common/settings-config";
import { tab } from "../tabs";

interface Props {
  show: boolean;
  menuTab: tab;
}

const Blacklist = ({ show, menuTab }: Props) => {
  const [toggled, setToggled] = useState(false);
  const [blacklist, setBlacklist] = useState<Array<string>>([]);

  useEffect(() => {
    storageFunctions.getSettings().then((settings) => {
      if (settings.mode === BlockMode.BLACKLIST) setToggled(true);
      else setToggled(false);
      setBlacklist(settings.blacklist);
    });
  }, [menuTab]);

  const blacklistToggle = async () => {
    toggled ? await setMode(BlockMode.BLOCK) : await setMode(BlockMode.BLACKLIST);
    setToggled(!toggled);
    storageFunctions.sendSettingsResetMessage();
  };

  const addSubreddit = async (subreddit: string) => {
    await pushBlacklist(subreddit);
    setBlacklist([...blacklist, subreddit]);
    storageFunctions.sendSettingsResetMessage();
  };

  const removeSubreddit = (subreddit: string) => {
    removeBlacklist(subreddit);
    setBlacklist(blacklist.filter((sub) => sub !== subreddit));
    storageFunctions.sendSettingsResetMessage();
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
      <SubredditList subreddits={blacklist} addSubreddit={addSubreddit} removeSubreddit={removeSubreddit} />
    </Options>
  );
};

export default Blacklist;
