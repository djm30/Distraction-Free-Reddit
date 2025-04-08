import React from "react";
import { useState, useEffect } from "react";
import storageFunctions, { toggleEnabled } from "../../common/storage-service";
import Switch from "../Options/Components/Switch";
import "./App.css";
import logger from "../../common/util/logger";
import { BlockerSettings, BlockMode } from "../../common/settings-config";

function App() {
  const openOptions = () => {
    chrome.runtime.openOptionsPage(() => logger.info("Opening the options page"));
  };

  const [toggled, setToggled] = useState(true);
  const [mode, setMode] = useState("Standard");

  const toggle = async () => {
    await toggleEnabled();
    setToggled(!toggled);
    storageFunctions.sendSettingsResetMessage();
  };

  const getMode = (settings: BlockerSettings) => {
    switch (settings.mode) {
      case BlockMode.WHITELIST:
        return "Whitelist";
      case BlockMode.BLACKLIST:
        return "Blacklist";
      default:
        return "Standard";
    }
  };

  useEffect(() => {
    storageFunctions.getSettings().then((settings) => {
      setMode(getMode(settings));
      setToggled(settings.enabled);
    });
  }, []);

  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-[#1a1d21] to-[#0e1113] text-gray-100 font-normal flex flex-col">
      <div className="p-3 text-center border-b border-gray-700 bg-black/30 shadow-md">
        <h1 className="text-xl font-bold text-white flex items-center justify-center gap-1">
          <span className="text-activeButtonHover">Distraction Free</span> Reddit
        </h1>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="bg-black/20 rounded-lg p-3 shadow-lg border border-gray-800 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">Extension Status</h3>
            <Switch toggled={toggled} setToggled={toggle} style={{ padding: "2px" }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {toggled
              ? "Currently removing distractions from Reddit"
              : "Extension is disabled. Reddit will display normally"}
          </p>
        </div>

        <div className="bg-black/20 rounded-lg p-3 shadow-lg border border-gray-800">
          <h3 className="text-base font-medium mb-2">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/30 p-2 rounded-lg">
              <p className="text-xs text-gray-400">Status</p>
              <p className={`text-sm font-medium ${toggled ? "text-green-400" : "text-gray-400"}`}>
                {toggled ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg">
              <p className="text-xs text-gray-400">Mode</p>
              <p className="text-sm font-medium text-blue-400">{mode}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-center pt-4">
          <button
            className="flex items-center justify-center gap-2 bg-activeButton hover:bg-activeButtonHover text-white font-medium rounded-lg px-4 py-1.5 transition-all shadow-lg"
            onClick={openOptions}
          >
            Advanced Options
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
