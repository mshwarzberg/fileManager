import { Fragment, useContext, useEffect, useState } from "react";
import sortDirectoryItems from "../../../Helpers/Sort";

import { GeneralContext } from "../../Main/App";

export default function DetailsView({
  detailsTabWidth,
  viewTypes,
  setDirectoryItems,
}) {
  const {
    settings: { currentSort, isSortDescending },
    setSettings,
  } = useContext(GeneralContext);

  const [scaleButton, setScaleButton] = useState({
    name: "",
    element: null,
  });

  function showArrow(viewType) {
    if (viewType.toLowerCase() === currentSort) {
      if (isSortDescending) {
        return "↓";
      } else {
        return "↑";
      }
    }
    return "";
  }

  useEffect(() => {
    function handleMouseMove(e) {
      setSettings((prevSettings) => {
        const [min, max] = prevSettings.detailsTabWidthLimits[scaleButton.name];
        let newWidth = Math.min(
          prevSettings.detailsTabWidth[scaleButton.name] + e.movementX / 16,
          max
        );
        newWidth = Math.max(newWidth, min);
        return {
          ...prevSettings,
          detailsTabWidth: {
            ...prevSettings.detailsTabWidth,
            [scaleButton.name]: newWidth,
          },
        };
      });
    }
    function handleMouseUp() {
      setScaleButton({});
    }
    if (scaleButton.name) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scaleButton]);

  return (
    <div className="details-view-buttons-container">
      {viewTypes.map((viewType) => {
        const viewTypeToLowerCase = viewType.toLowerCase();
        return detailsTabWidth[viewTypeToLowerCase] !== 0 ? (
          <div
            key={viewType}
            onClick={() => {
              sortDirectoryItems(
                setDirectoryItems,
                viewType,
                !isSortDescending
              );
              setSettings((prevSettings) => ({
                ...prevSettings,
                isSortDescending: !isSortDescending,
                currentSort: viewTypeToLowerCase,
              }));
            }}
            className="details-view-button"
            style={{
              width: detailsTabWidth[viewTypeToLowerCase] + "rem",
            }}
          >
            {showArrow(viewType)} {viewType}
            <div
              id="scaler"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setScaleButton({
                  name: viewTypeToLowerCase,
                  element: e.target,
                });
              }}
            />
          </div>
        ) : (
          <Fragment key={viewType} />
        );
      })}
    </div>
  );
}
