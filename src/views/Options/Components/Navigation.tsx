import React from "react";
import { useState } from "react";

interface props {
  setNavigation: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation = ({ setNavigation }: props) => {
  const [active, setActive] = useState("general");

  const getClasses = (linkName: string) => {
    if (linkName === active) {
      return "text-white border-b-4 py-1 border-white cursor-pointer";
    }
    return "hover:text-white py-1 cursor-pointer";
  };

  const setActiveLink = (linkName: string) => {
    return () => setActive(linkName);
  };

  return (
    <div className="border-darkBorder border-b-2 space-x-4 mt-2 pb-2 text-darkText font-bold">
      <span
        className={getClasses("general")}
        onClick={setActiveLink("general")}
      >
        General
      </span>
      <span
        className={getClasses("whitelist")}
        onClick={setActiveLink("whitelist")}
      >
        Whitelist
      </span>
      <span
        className={getClasses("blacklist")}
        onClick={setActiveLink("blacklist")}
      >
        Blacklist
      </span>
    </div>
  );
};

export default Navigation;
