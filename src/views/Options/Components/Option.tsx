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
    <div className="py-3 px-2 flex justify-between items-center hover:bg-black/10 transition-colors rounded">
      {/* TEXT */}
      <div className="flex flex-col justify-center min-w-0 shrink max-w-[80%]">
        <span className="text-primaryText text-lg font-medium">{title}</span>
        <span className="text-secondaryText text-sm mt-0.5">{description}</span>
      </div>

      {/* SWITCH */}
      <div className="flex-shrink-0">
        <Switch toggled={toggled} setToggled={setToggled} />
      </div>
    </div>
  );
};

export default Option;
