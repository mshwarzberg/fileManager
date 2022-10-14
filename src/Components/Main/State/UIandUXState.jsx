import { useEffect, useState } from "react";

export default function UIandUXState() {
  const initSettings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settings, setSettings] = useState({
    darkMode: initSettings.darkMode,
    iconSize: initSettings.iconSize || "large",
    showDirectoryTree: initSettings.showDirectoryTree !== false,
    treeWidth: initSettings.treeWidth || 260,
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
        treeWidth: settings.treeWidth,
      })
    );
  }, [settings]);

  return { settings, setSettings };
}
