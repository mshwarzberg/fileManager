import { useEffect, useState } from "react";

export default function UIandUXState() {
  const initSettings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settings, setSettings] = useState({
    showDirectoryTree: initSettings.showDirectoryTree !== false,
    showThumbnails: initSettings.showThumbnails !== false,
    clickToOpen: initSettings.clickToOpen || "double",
    currentSort: initSettings.currentSort || "name",
    isSortDescending: initSettings.currentSort !== false,
  });

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
}
