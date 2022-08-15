import React from "react";
import { useState } from "react";
import "./Switch.module.css";

interface styles {
  body: string;
  circle: string;
}

const Switch: React.FC = () => {
  const [toggled, setToggled] = useState<boolean>(false);

  const on: styles = {
    body: "bg-buttonBlue ",
    circle: "right-1",
  };

  const off: styles = {
    body: "bg-switchGrey",
    circle: "left-1",
  };

  const classes = toggled ? on : off;

  return (
    <div
      className="py-[12px] pl-2 cursor-pointer"
      onClick={() => setToggled(!toggled)}
    >
      <div
        className={`w-16 h-8 rounded-full relative cursor-pointer transition-all ${classes.body}`}
      >
        {/* CIRCLE */}
        <div
          className={`rounded-full absolute top-1 bg-lightBorder transition-all h-6 w-6 ${classes.circle}`}
        ></div>
      </div>
    </div>
  );
};

export default Switch;
