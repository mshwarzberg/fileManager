import { useContext, useEffect, useState } from "react";

import { GeneralContext } from "../../Main/App";

import compareObjects from "../../../Helpers/CompareObjects";

export default function SettingsBody({ setPopup }) {
  const { settings, setSettings } = useContext(GeneralContext);
  const [tempSettings, setTempSettings] = useState(settings);

  const {
    clickToOpen,
    showThumbnails,
    iconSize,
    pageCompactView,
    treeCompactView,
    appTheme,
  } = tempSettings;

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
      <div onChange={handleChange} className="settings-block">
        <h2 className={`text-${appliedAppTheme}`}>Opening Files and Folders</h2>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="radio"
            value="single"
            name="clickToOpen"
            checked={clickToOpen === "single"}
            readOnly
          />
          Single Click To Open
        </label>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="radio"
            value="double"
            name="clickToOpen"
            checked={clickToOpen === "double"}
            readOnly
          />
          Double Click To Open
        </label>
        <div className="horizontal-separator" />
      </div>
      <div onChange={handleChange} className="settings-block">
        <h2 className={`text-${appliedAppTheme}`}>Show Thumbnails Or Icons</h2>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="radio"
            value={true}
            name="showThumbnails"
            checked={showThumbnails === true}
            readOnly
          />
          Show Thumbnails
        </label>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="radio"
            value={false}
            name="showThumbnails"
            checked={showThumbnails === false}
            readOnly
          />
          Only Show Icons
        </label>
        <div className="horizontal-separator" />
      </div>
      <div className="settings-block">
        <h2 className={`text-${appliedAppTheme}`}>Change Icon Size</h2>
        <label id="icon-size-slider">
          <input
            type="range"
            name="iconSize"
            step={0.5}
            min={6}
            max={16}
            value={iconSize}
            onChange={handleChange}
          />
          {iconSize * 16 + "px"}
        </label>
        <div className="horizontal-separator" />
      </div>
      <div className="settings-block">
        <h2 className={`text-${appliedAppTheme}`}>Compact View</h2>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="checkbox"
            name="pageCompactView"
            onChange={handleChange}
            checked={pageCompactView}
          />
          Enabled On Page
        </label>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="checkbox"
            name="treeCompactView"
            onChange={handleChange}
            checked={treeCompactView}
          />
          Enabled On Folder Tree
        </label>
        <div className="horizontal-separator" />
      </div>
      <div onChange={handleChange} className="settings-block">
        <h2 className={`text-${appliedAppTheme}`}>Turn On Dark Mode</h2>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="radio"
            value="dark-mode"
            name="appTheme"
            checked={appTheme === "dark-mode"}
            readOnly
          />
          Dark Mode
        </label>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="radio"
            value="light-mode"
            name="appTheme"
            checked={appTheme === "light-mode"}
            readOnly
          />
          Light Mode
        </label>
        <div className="horizontal-separator" />
      </div>
    </div>
  );
}
