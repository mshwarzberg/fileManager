import { useEffect, useState } from "react";

export default function ViewsState() {
  const initViews = JSON.parse(localStorage.getItem("views") || "{}");

  const [views, setViews] = useState({
    pageCompactView: initViews.pageCompactView,
    treeCompactView: initViews.treeCompactView,
    appTheme: initViews.appTheme || "dark-mode",
    pageView: initViews.pageView || "icon",
    treeWidth: initViews.treeWidth || 260,
    iconSize: initViews.iconSize || 12,
    detailsTabWidth: initViews.detailsTabWidth || {
      name: 15,
      modified: 12,
      type: 8,
      size: 5,
      duration: 5,
      dimensions: 5,
      description: 15,
    },
    detailsTabWidthLimits: {
      name: [5, 35],
      modified: [8, 15],
      type: [5, 10],
      size: [5, 8],
      duration: [5, 10],
      dimensions: [5, 10],
      description: [10, Infinity],
    },
  });

  useEffect(() => {
    localStorage.setItem("views", JSON.stringify(views));
  }, [views]);

  return { views, setViews };
}
