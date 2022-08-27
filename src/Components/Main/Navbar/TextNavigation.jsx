import React, { useContext, useEffect } from "react";
import arrow from "../../../Assets/images/directorytree/right-arrow-white.png";
import { GeneralContext } from "../App";
import { foundInArrayWithKey } from "../../../Helpers/SearchArray";

export default function TextNavigation() {
  const { state, dispatch, directoryItems } = useContext(GeneralContext);

  function currentDirectoryNavigation() {
    let directories = state.currentDirectory?.split("/");
    directories = directories.slice(0, directories.length - 1);
    directories.unshift("");
    return directories;
  }
  useEffect(() => {
    function handleMouseDown() {
      for (const element of document.getElementsByClassName(
        "text-navigation-children"
      )) {
        element.style.display = "none";
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const renderDirectoryNavigation = currentDirectoryNavigation().map(
    (directory, index) => {
      let path = "";
      for (let i = 0; i <= index; i++) {
        if (directory && currentDirectoryNavigation()[i]) {
          path += currentDirectoryNavigation()[i] + "/";
        }
      }
      return (
        <>
          <button
            onClick={() => {
              dispatch({
                type: "openDirectory",
                value: path,
              });
            }}
            key={path + "button"}
            data-destination={JSON.stringify({ destination: path })}
          >
            {directory || "This PC"}
          </button>
          {(foundInArrayWithKey(directoryItems, "folder", "itemtype") ||
            index !== currentDirectoryNavigation().length - 1) && (
            <div id="arrow-and-child-directories">
              <img
                src={arrow}
                alt=""
                key={path + "img"}
                onClick={(e) => {
                  for (const element of document.getElementsByClassName(
                    "text-navigation-children"
                  )) {
                    element.style.display = "none";
                  }
                  e.target.parentElement.lastChild.style.display = "block";
                }}
              />
              <div className="text-navigation-children" />
            </div>
          )}
        </>
      );
    }
  );
  return <div id="text-navigation-container">{renderDirectoryNavigation}</div>;
}
