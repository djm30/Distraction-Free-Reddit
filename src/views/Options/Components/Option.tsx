import React from "react";
import Switch from "./Switch";

interface Props {
  title: string;
  description: string;
  toggled: boolean;
  setToggled: () => void;
}

const Option: React.FC<Props> = ({ title, description, toggled, setToggled }) => {
  return (
    <div className="pb-2 flex justify-between items-center">
      {/* TEXT */}
      <div className="flex flex-col justify-center min-w-0 shrink py-1">
        <span className="text-primaryText text-lg">{title}</span>
        <span className="text-secondaryText text-base -mt-1">{description}</span>
      </div>
      {/* SWITCH */}
      <Switch toggled={toggled} setToggled={setToggled} />
    </div>
  );
};

export default Option;
