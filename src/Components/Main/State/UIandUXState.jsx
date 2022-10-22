import { useEffect, useState } from "react";

export default function UIandUXState() {
  const initSettings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settings, setSettings] = useState({
    appTheme: initSettings.appTheme || "dark-mode",
    iconSize: initSettings.iconSize || 12,
    showDirectoryTree: initSettings.showDirectoryTree !== false,
    treeWidth: initSettings.treeWidth || 260,
    showThumbnails: initSettings.showThumbnails !== false,
    clickToOpen: initSettings.clickToOpen || "double",
    pageCompactView: initSettings.pageCompactView,
    treeCompactView: initSettings.treeCompactView,
  });

  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        appTheme: settings.appTheme,
        iconSize: settings.iconSize,
        showDirectoryTree: settings.showDirectoryTree,
        treeWidth: settings.treeWidth,
        showThumbnails: settings.showThumbnails,
        clickToOpen: settings.clickToOpen,
        pageCompactView: settings.pageCompactView,
        treeCompactView: settings.treeCompactView,
      })
    );
  }, [settings]);

  return { settings, setSettings };
}
