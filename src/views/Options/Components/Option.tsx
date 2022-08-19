import React from "react";
import Switch from "./Switch";

interface Props {
  title: string;
  description: string;
  toggled: boolean;
  setToggled: () => void;
}

const Option: React.FC<Props> = ({
  title,
  description,
  toggled,
  setToggled,
}) => {
  return (
    <div className="border-b-2 border-darkBorder pb-2 flex justify-between items-center">
      {/* TEXT */}
      <div className="font-bold space-y-1">
        <p className="text-white text-lg">{title}</p>
        <p className="text-darkText text-base">{description}</p>
      </div>
      {/* SWITCH */}
      <Switch toggled={toggled} setToggled={setToggled} />
    </div>
  );
};

export default Option;
