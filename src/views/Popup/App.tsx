import React from "react";
import { useState, useEffect } from "react";
import storageFunctions, { toggleEnabled } from "../../common/storage-service";
import Switch from "../Options/Components/Switch";
import "./App.css";
import logger from "../../common/util/logger";

function App() {
  const openOptions = () => {
    chrome.runtime.openOptionsPage(() => logger.info("Opening the options page"));
  };

  const [toggled, setToggled] = useState(false);

  const toggle = async () => {
    await toggleEnabled();
    setToggled(!toggled);
    storageFunctions.sendSettingsResetMessage();
  };
  useEffect(() => {
    storageFunctions.getSettings().then((settings) => setToggled(settings.enabled));
  }, []);

  return (
    <div className="w-full min-h-[400px] text-primaryText font-normal">
      <div className="bg-[#0e1113] p-4 text-center border-b-[0.0625rem] border-darkBorder">
        <h1 className="text-3xl ">Distraction-Free Reddit</h1>
      </div>
      <div className="rounded-[1.25rem]  mt-6 mx-8 h-60 p-4 ">
        <div className="flex flex-col items-center justify-betweenspace-y-3 mt-4 mb-10">
          <button className="w-24 h-24 bg-inactiveButton hover:bg-inactiveButtonHover rounded-full">Enable</button>
          {/* <h3 className="text-xl">Enabled</h3> */}
          {/* <Switch toggled={toggled} setToggled={toggle} style={{ padding: "2px" }} /> */}
        </div>
        <div className="flex justify-center">
          <button
            className="text-base bg-inactiveButton hover:bg-inactiveButtonHover rounded-full px-4 py-2 transition-all"
            onClick={openOptions}
          >
            Options
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
