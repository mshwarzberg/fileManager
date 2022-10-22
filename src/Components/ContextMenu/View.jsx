import { useContext } from "react";
import { GeneralContext } from "../Main/App.jsx";

export default function View({ contextMenu }) {
  const { setSettings, settings } = useContext(GeneralContext);
  const { iconSize } = settings;
  const views = ["Small", "Medium", "Large", "Extra Large"];

  function matchSize() {
    if (iconSize <= 8) {
      return "Small";
    }
    if (iconSize > 8 && iconSize <= 10) {
      return "Medium";
    }
    if (iconSize > 10 && iconSize <= 12) {
      return "Large";
    }
    return "Extra Large";
  }

  return (
    <div
      className={`sort-by-sub-menu ${
        contextMenu.x + 320 > window.innerWidth ? "position-left" : ""
      }`}
    >
      {views.map((viewOption) => {
        return (
          <button
            key={viewOption}
            onClick={() => {
              let newSize;
              if (viewOption === "Small") {
                newSize = 8;
              } else if (viewOption === "Medium") {
                newSize = 10;
              } else if (viewOption === "Large") {
                newSize = 12;
              } else if (viewOption === "Extra Large") {
                newSize = 14;
              }
              setSettings((prevSettings) => ({
                ...prevSettings,
                iconSize: newSize,
              }));
            }}
          >
            {viewOption === matchSize() && <div id="dot" />}
            {viewOption}
          </button>
        );
      })}
    </div>
  );
}
