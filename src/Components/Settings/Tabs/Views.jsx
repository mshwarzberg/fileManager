import React, { useEffect, useState } from "react";

export default function Views({ temp, appliedAppTheme, handleChange }) {
  const {
    showThumbnails,
    iconSize,
    pageCompactView,
    treeCompactView,
    appTheme,
    pageView,
  } = temp;

  const [viewsOptions, setViewsOptions] = useState();

  useEffect(() => {
    setViewsOptions();
  }, [temp]);

  return (
    <>
      <div
        onChange={(e) => {
          handleChange(e, "settings");
        }}
        className="settings-block"
      >
        <h2 className={`text-${appliedAppTheme}`}>Show Thumbnails Or Icons</h2>
        {[true, false].map((toShow) => {
          return (
            <label className={`text-${appliedAppTheme}`} key={toShow}>
              <input
                type="radio"
                value={toShow}
                name="showThumbnails"
                checked={toShow === showThumbnails}
                readOnly
              />
              {toShow ? "Show Thumbnails" : "Only Show Icons"}
            </label>
          );
        })}
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
            onChange={(e) => {
              handleChange(e, "views");
            }}
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
            onChange={(e) => {
              handleChange(e, "views");
            }}
            checked={pageCompactView}
          />
          Enabled On Page
        </label>
        <label className={`text-${appliedAppTheme}`}>
          <input
            type="checkbox"
            name="treeCompactView"
            onChange={(e) => {
              handleChange(e, "views");
            }}
            checked={treeCompactView}
          />
          Enabled On Folder Tree
        </label>
        <div className="horizontal-separator" />
      </div>
      <div
        onChange={(e) => {
          handleChange(e, "views");
        }}
        className="settings-block"
      >
        <h2 className={`text-${appliedAppTheme}`}>Color Theme</h2>
        {["Dark Mode", "Light Mode", "Sky Blue"].map((theme) => {
          return (
            <label className={`text-${appliedAppTheme}`} key={theme}>
              <input
                type="radio"
                value={theme.toLowerCase().replace(" ", "-")}
                name="appTheme"
                checked={appTheme === theme.toLowerCase().replace(" ", "-")}
                readOnly
              />
              {theme}
            </label>
          );
        })}
        <div className="horizontal-separator" />
      </div>
      <div className="settings-block">
        <h2 className={`text-${appliedAppTheme}`}>Page View</h2>
        <button
          id="view-selection"
          className={`button-${appTheme}`}
          onClick={() => {
            if (!viewsOptions) {
              setViewsOptions(
                ["Icon", "List", "Details", "Content", "Tiles"].map((view) => {
                  return (
                    <button
                      key={view}
                      id="view-option"
                      className={`button-${appTheme}`}
                      value={view.toLowerCase()}
                      name="pageView"
                      onClick={(e) => {
                        handleChange(e, "views");
                      }}
                    >
                      {view}
                    </button>
                  );
                })
              );
            } else {
              setViewsOptions();
            }
          }}
          onBlur={(e) => {
            if (e.relatedTarget?.id !== "view-option") {
              setViewsOptions();
            }
          }}
        >
          {pageView[0].toUpperCase() + pageView.slice(1, Infinity)} ↑
        </button>
        <div id="options-container">{viewsOptions}</div>
      </div>
    </>
  );
}
