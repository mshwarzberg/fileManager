import React, { useEffect, useState } from "react";

enum Theme {
  darkMode = "dark-mode",
  lightMode = "light-mode",
  skyBlue = "sky-blue",
}

enum View {
  icon = "icon",
  content = "content",
  details = "details",
  list = "list",
  tiles = "tiles",
}

interface State {
  pageCompactView: boolean;
  treeCompactView: boolean;
  appTheme: Theme;
  pageView: View;
  treeWidth: number;
  iconSize: number;
  detailsTabWidth: {
    name: number;
    modified: number;
    type: number;
    size: number;
    duration: number;
    dimensions: number;
    description: number;
  };
  detailsTabWidthLimits: {
    name: [number, number];
    modified: [number, number];
    type: [number, number];
    size: [number, number];
    duration: [number, number];
    dimensions: [number, number];
    description: [number, number];
  };
}

const ViewsState = () => {
  const initViews = JSON.parse(localStorage.getItem("views") || "{}");

  const [views, setViews] = useState<State>({
    pageCompactView: initViews.pageCompactView,
    treeCompactView: initViews.treeCompactView,
    appTheme: initViews.appTheme || Theme.lightMode,
    pageView: initViews.pageView || View.icon,
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
};

export default ViewsState;
