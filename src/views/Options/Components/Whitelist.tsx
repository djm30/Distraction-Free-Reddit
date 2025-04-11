import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";
import { tab } from "../tabs";
import { useState, useEffect } from "react";
import storageFunctions, { setMode, pushWhitelist, removeWhitelist } from "../../../common/storage-service";
import { BlockMode } from "../../../common/settings-config";

interface Props {
  show: boolean;
  menuTab: tab;
}

const Whitelist = ({ show, menuTab }: Props) => {
  const [toggled, setToggled] = useState(false);
  const [whitelist, setWhitelist] = useState<Array<string>>([]);

  useEffect(() => {
    storageFunctions.getSettings().then((settings) => {
      if (settings.mode === BlockMode.WHITELIST) setToggled(true);
      else setToggled(false);
      setWhitelist(settings.whitelist);
    });
  }, [menuTab]);

  const whitelistToggle = async () => {
    toggled ? await setMode(BlockMode.BLOCK) : await setMode(BlockMode.WHITELIST);
    setToggled(!toggled);
    storageFunctions.sendSettingsResetMessage();
  };

  const addSubreddit = async (subreddit: string) => {
    if (whitelist.includes(subreddit)) {
      return;
    }

    await pushWhitelist(subreddit);
    setWhitelist([...whitelist, subreddit]);
    storageFunctions.sendSettingsResetMessage();
  };

  const removeSubreddit = (subreddit: string) => {
    removeWhitelist(subreddit);
    setWhitelist(whitelist.filter((sub) => sub !== subreddit));
    storageFunctions.sendSettingsResetMessage();
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
      <SubredditList subreddits={whitelist} addSubreddit={addSubreddit} removeSubreddit={removeSubreddit} />
    </Options>
  );
};

export default Whitelist;
