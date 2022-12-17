import { useContext, useEffect, useState } from "react";

import { GeneralContext } from "../Main/Main";

import Views from "./Tabs/Views";
import Interactions from "./Tabs/Interactions";
import ClearData from "./Tabs/ClearData";

import compareObjects from "../../Helpers/CompareObjects";

export default function SettingsBody({ setPopup }) {
  const { settings, setSettings, views, setViews } = useContext(GeneralContext);

  const [temp, setTemp] = useState({
    settings: settings,
    views: views,
  });

  const [tabView, setTabView] = useState("Views");

  const { appTheme: appliedAppTheme } = views;

  function handleChange(e, change) {
    let { name, value, checked, type } = e.target;
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }
    if (type === "checkbox") {
      value = checked;
    }
    if (change === "views") {
      setTemp((prevTemp) => ({
        ...prevTemp,
        views: {
          ...prevTemp.views,
          [name]: value,
        },
      }));
    } else if (change === "settings") {
      setTemp((prevTemp) => ({
        ...prevTemp,
        settings: {
          ...prevTemp.settings,
          [name]: value,
        },
      }));
    }
  }

  useEffect(() => {
    const applyButton = document.getElementById("apply-settings");
    const okButton = document.getElementById("ok-settings");

    function handleClick(e) {
      setSettings(temp.settings);
      setViews(temp.views);
      if (e.target.id.startsWith("ok")) {
        setPopup({});
      }
    }
    if (
      compareObjects(temp.settings, settings) &&
      compareObjects(temp.views, views)
    ) {
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
  }, [temp, settings, views]);

  useEffect(() => {
    setTemp((prevTemp) => ({
      ...prevTemp,
      settings: settings,
    }));
  }, [settings]);

  useEffect(() => {
    setTemp((prevTemp) => ({
      ...prevTemp,
      views: views,
    }));
  }, [views]);

  return (
    <div id="settings-body">
      <div id="tab-container">
        <button
          className={`button-${appliedAppTheme}`}
          onClick={() => {
            setTabView("Views");
          }}
        >
          Views
        </button>
        <button
          className={`button-${appliedAppTheme}`}
          onClick={() => {
            setTabView("Interactions");
          }}
        >
          Interactions
        </button>
        <button
          className={`button-${appliedAppTheme}`}
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
          clickToOpen={temp.settings.clickToOpen}
          handleChange={handleChange}
        />
      )}
      {tabView === "Views" && (
        <Views
          temp={{ ...temp.views, ...temp.settings }}
          handleChange={handleChange}
          appliedAppTheme={appliedAppTheme}
        />
      )}
      {tabView === "Clear Data" && <ClearData />}
    </div>
  );
}
