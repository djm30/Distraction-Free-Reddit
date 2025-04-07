import React from "react";
import { useState } from "react";
import switchStyles from "./Switch.module.css";

interface styles {
  body: string;
  circle: string;
}

interface Props {
  style?: React.CSSProperties;
  toggled: boolean;
  setToggled: () => void;
}

const Switch: React.FC<Props> = ({ style, toggled, setToggled }) => {
  const on: styles = {
    body: `${switchStyles.active}`,
    circle: "active left-[18px]",
  };

  const off: styles = {
    body: `${switchStyles.unactive}`,
    circle: "left-0.5",
  };

  const classes = toggled ? on : off;

  return (
    <div className="py-[12px] pl-2 cursor-pointer" style={style} onClick={() => setToggled()}>
      <div
        className={`w-12 h-8 rounded-full relative cursor-pointer transition-all ${switchStyles.switch} ${classes.body}`}
      >
        {/* CIRCLE */}
        <div className={`rounded-full absolute top-0.5  bg-lightBorder transition-all h-7 w-7 ${classes.circle}`}></div>
      </div>
    </div>
  );
};

export default Switch;
