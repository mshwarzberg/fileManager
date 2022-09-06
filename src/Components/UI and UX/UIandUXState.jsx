import React, { useEffect, useState } from "react";

export default function UIandUXState() {
  const initSettings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settings, setSettings] = useState({
    darkMode: initSettings.darkMode,
    iconSize: initSettings.iconSize || 152,
    showDirectoryTree: initSettings.showDirectoryTree !== false,
    showThumbnails: initSettings.showThumbnails !== false,
    singleClickToOpen: initSettings.singleClickToOpen,
    compactView: initSettings.compactView,
  });

  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        darkMode: settings.darkMode,
        iconSize: settings.iconSize,
        showDirectoryTree: settings.showDirectoryTree,
        showThumbnails: settings.showThumbnails,
        singleClickToOpen: settings.singleClickToOpen,
        compactView: settings.compactView,
      })
    );
  }, [settings]);

  return { settings, setSettings };
}
