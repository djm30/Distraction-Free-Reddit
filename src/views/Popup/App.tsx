import React from "react";
import { useState, useEffect } from "react";
import storageFunctions, { toggleEnabled } from "../../common/storage-service";
import Switch from "../Options/Components/Switch";
import "./App.css";
import logger from "../../common/logger";

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
    <div className="w-full min-h-[400px] text-white">
      <div className="bg-cardGrey p-4 text-center border-b-2 border-darkBorder">
        <h1 className="text-3xl font-bold">Distraction-Free Reddit</h1>
      </div>
      <div className="rounded-[4px] border-darkBorder border-2 mt-6 mx-8 h-60 bg-cardGrey p-4 ">
        <div className="flex flex-col items-center justify-center space-y-3 mt-4 mb-10">
          <h3 className="font-bold text-xl">Enabled</h3>
          <Switch toggled={toggled} setToggled={toggle} style={{ padding: "2px" }} />
        </div>
        <div className="flex justify-center">
          <button
            className="text-base bg-buttonBlue hover:bg-[#118ff0] rounded-[4px] px-8 py-3 transition-all"
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
