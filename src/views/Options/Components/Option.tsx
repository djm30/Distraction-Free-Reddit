import React from "react";
import Switch from "./Switch";

const Option: React.FC = () => {
  return (
    <div className="border-b-2 border-darkBorder pb-2 flex justify-between items-center">
      {/* TEXT */}
      <div className="font-bold space-y-1">
        <p className="text-white text-lg">Hide Main Feed</p>
        <p className="text-darkText">Hides the main feed on the homepage</p>
      </div>
      {/* SWITCH */}
      <Switch />
    </div>
  );
};

export default Option;
