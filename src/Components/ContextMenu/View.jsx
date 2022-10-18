import { useContext } from "react";
import { DirectoryContext } from "../Main/App.jsx";

export default function View({ contextMenu }) {
  const { setSettings, settings } = useContext(DirectoryContext);
  const { iconSize } = settings;
  const views = ["Small", "Medium", "Large", "Extra Large"];
  return (
    <div
      className={`sort-by-sub-menu ${
        contextMenu.x + 320 > window.innerWidth ? "position-left" : ""
      }`}
    >
      {views.map((viewOption) => {
        return (
          <button
            className="context-menu-button"
            key={viewOption}
            onClick={() => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                iconSize: viewOption.split(" ").join("").toLowerCase(),
              }));
            }}
          >
            {iconSize === viewOption.split(" ").join("").toLowerCase() && (
              <div id="dot" />
            )}
            {viewOption}
          </button>
        );
      })}
    </div>
  );
}
