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
      return "text-white border-b-4 py-1 border-white cursor-pointer";
    }
    return "hover:text-white py-1 cursor-pointer";
  };

  const setActiveLink = (linkName: tab) => {
    return () => {
      setMenuTab(linkName);
      setActive(linkName);
    };
  };

  return (
    <div className="border-darkBorder border-b-2 space-x-4 mt-2 pb-2 text-base text-darkText font-bold select-none">
      <span
        className={getClasses(tab.GENERAL)}
        onClick={setActiveLink(tab.GENERAL)}
      >
        General
      </span>
      <span
        className={getClasses(tab.WHITELIST)}
        onClick={setActiveLink(tab.WHITELIST)}
      >
        Whitelist
      </span>
      <span
        className={getClasses(tab.BLACKLIST)}
        onClick={setActiveLink(tab.BLACKLIST)}
      >
        Blacklist
      </span>
    </div>
  );
};

export default Navigation;
