import { useContext } from "react";
import { GeneralContext } from "../Main/App.jsx";

export default function View({ contextMenu }) {
  const {
    setSettings,
    settings: { iconSize, pageView },
  } = useContext(GeneralContext);
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
                pageView: "icon",
              }));
            }}
          >
            {viewOption === matchSize() && pageView === "icon" && (
              <div id="dot" />
            )}
            {viewOption} Icons
          </button>
        );
      })}
      <div
        id="divider"
        style={{
          height: "1rem",
          backgroundColor: "rebeccapurple",
          width: "100%",
        }}
      />
      {["List", "Details", "Tiles", "Content"].map((view) => {
        return (
          <button
            key={view}
            onClick={() => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                pageView: view.toLowerCase(),
              }));
            }}
          >
            {view.toLowerCase() === pageView && <div id="dot" />}
            {view}
          </button>
        );
      })}
    </div>
  );
}
