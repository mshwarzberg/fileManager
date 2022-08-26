import React, { useContext } from "react";
import arrow from "../../../Assets/images/directorytree/right-arrow-white.png";
import { GeneralContext } from "../App";

export default function TextNavigation() {
  const { state, dispatch } = useContext(GeneralContext);

  function currentDirectoryNavigation() {
    let directories = state.currentDirectory?.split("/");
    directories = directories.slice(0, directories.length - 1);
    directories.unshift("");
    return directories;
  }
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
            data-destination={JSON.stringify({ path: path })}
          >
            {directory || "This PC"}
          </button>
          <div id="arrow-and-child-directories">
            <img src={arrow} alt="show child directories" key={path + "img"} />
          </div>
        </>
      );
    }
  );
  return <div id="text-navigation-container">{renderDirectoryNavigation}</div>;
}
