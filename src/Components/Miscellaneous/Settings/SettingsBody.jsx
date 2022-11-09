import { useContext, useEffect, useState } from "react";

import { GeneralContext } from "../../Main/App";

import Views from "./Tabs/Views";
import Interactions from "./Tabs/Interactions";
import ClearData from "./Tabs/ClearData";

import compareObjects from "../../../Helpers/CompareObjects";

export default function SettingsBody({ setPopup }) {
  const { settings, setSettings } = useContext(GeneralContext);
  const [tempSettings, setTempSettings] = useState(settings);
  const [tabView, setTabView] = useState("Views");

  const { appTheme: appliedAppTheme } = settings;

  function handleChange(e) {
    let { name, value, checked, type } = e.target;
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }
    if (type === "checkbox") {
      value = checked;
    }
    setTempSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  }

  useEffect(() => {
    const applyButton = document.getElementById("apply-settings");
    const okButton = document.getElementById("ok-settings");

    function handleClick(e) {
      setSettings(tempSettings);
      if (e.target.id.startsWith("ok")) {
        setPopup({});
      }
    }
    if (compareObjects(tempSettings, settings)) {
      applyButton.disabled = true;
    } else {
      applyButton.disabled = false;
    }

    applyButton?.addEventListener("click", handleClick);
    okButton?.addEventListener("click", handleClick);

    return () => {
      applyButton?.removeEventListener("click", handleClick);
      okButton?.removeEventListener("click", handleClick);
    };
  }, [tempSettings, settings]);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  return (
    <div id="settings-body">
      <div id="tab-container">
        <button
          onClick={() => {
            setTabView("Views");
          }}
        >
          Views
        </button>
        <button
          onClick={() => {
            setTabView("Interactions");
          }}
        >
          Interactions
        </button>
        <button
          onClick={() => {
            setTabView("Clear Data");
          }}
        >
          Clear Data
        </button>
      </div>
      {tabView === "Interactions" && (
        <Interactions
          appliedAppTheme={appliedAppTheme}
          clickToOpen={tempSettings.clickToOpen}
          handleChange={handleChange}
        />
      )}
      {tabView === "Views" && (
        <Views
          tempSettings={tempSettings}
          handleChange={handleChange}
          appliedAppTheme={appliedAppTheme}
        />
      )}
      {tabView === "Clear Data" && <ClearData />}
    </div>
  );
}
