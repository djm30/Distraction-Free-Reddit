import React from "react";
import { useState } from "react";

const Switch: React.FC = () => {
  return (
    <div>
      <div className="w-16 h-8 bg-switchGrey rounded-full relative">
        {/* CIRCLE */}
        <div className="rounded-full absolute top-1 left-1 bg-lightBorder h-6 w-6"></div>
      </div>
    </div>
  );
};

export default Switch;
