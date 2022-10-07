import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";

import arrowBlack from "../../../Images/arrow-black.png";
import arrowWhite from "../../../Images/arrow-white.png";

export default function ButtonNavigation() {
  const { state, dispatch } = useContext(DirectoryContext);

  function handleMouse(e) {
    if (e.type === "mouseenter") {
      e.target.firstChild.src = arrowBlack;
    } else {
      e.target.firstChild.src = arrowWhite;
    }
  }
  return (
    <div id="navbar-navigation">
      <button
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        onClick={() => {
          let uppedDirectory = "";
          for (let i = state.currentDirectory.length - 2; i >= 0; i--) {
            if (state.currentDirectory[i] === "/") {
              uppedDirectory = state.currentDirectory.slice(0, i + 1);
              break;
            }
          }

          dispatch({ type: "up", value: uppedDirectory });
        }}
        disabled={state.currentDirectory === ""}
      >
        <img src={arrowWhite} alt="up" />
      </button>
      <button
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        id="navigate-back"
        onClick={() => {
          dispatch({ type: "back" });
        }}
        disabled={state.navigatedIndex === 0}
      >
        <img src={arrowWhite} alt="back" id="left-arrow" />
      </button>
      <button
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
        id="navigate-forwards"
        onClick={() => {
          dispatch({ type: "forwards" });
        }}
        disabled={
          state.navigatedIndex === state.navigatedDirectories.length - 1
        }
      >
        <img src={arrowWhite} alt="forwards" id="right-arrow" />
      </button>
    </div>
  );
}
