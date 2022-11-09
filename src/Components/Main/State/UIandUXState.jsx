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
    pageView: initSettings.pageView || "icon",
    currentSort: initSettings.currentSort || "name",
    isSortDescending: initSettings.currentSort !== false,
    detailsTabWidth: initSettings.detailsTabWidth || {
      name: 15,
      modified: 12,
      type: 8,
      size: 5,
      duration: 5,
      dimensions: 5,
    },
    detailsTabWidthLimits: {
      name: [5, 35],
      modified: [8, 15],
      type: [5, 10],
      size: [5, 8],
      duration: [5, 10],
      dimensions: [5, 10],
    },
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
        pageView: settings.pageView,
        currentSort: settings.currentSort,
        isSortDescending: settings.isSortDescending,
        detailsTabWidth: settings.detailsTabWidth,
      })
    );
  }, [settings]);

  return { settings, setSettings };
}
