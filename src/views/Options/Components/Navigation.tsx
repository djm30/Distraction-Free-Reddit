import React from "react";
import { useState } from "react";
import { tab } from "../tabs";

interface props {
  setMenuTab: React.Dispatch<React.SetStateAction<tab>>;
}

const Navigation = ({ setMenuTab }: props) => {
  const [active, setActive] = useState("general");

  const getClasses = (linkName: string) => {
    if (linkName === active) {
      return "text-importantText border-b-2 py-3 px-4 border-white cursor-pointer hover:border-secondaryText";
    }
    return "py-3 px-4 cursor-pointer hover:text-importantText hover:border-b-2 hover:border-secondaryText";
  };

  const setActiveLink = (linkName: tab) => {
    return () => {
      setMenuTab(linkName);
      setActive(linkName);
    };
  };

  return (
    <div className="space-x-8 pb-2 text-base text-secondaryText  select-none">
      <span className={getClasses(tab.GENERAL)} onClick={setActiveLink(tab.GENERAL)}>
        General
      </span>
      <span className={getClasses(tab.WHITELIST)} onClick={setActiveLink(tab.WHITELIST)}>
        Whitelist
      </span>
      <span className={getClasses(tab.BLACKLIST)} onClick={setActiveLink(tab.BLACKLIST)}>
        Blacklist
      </span>
    </div>
  );
};

export default Navigation;
