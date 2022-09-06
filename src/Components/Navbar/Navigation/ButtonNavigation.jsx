import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";

export default function ButtonNavigation() {
  const { state, dispatch } = useContext(DirectoryContext);

  return (
    <div id="navbar-navigation">
      <button
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
        className="navbar-button"
        disabled={state.currentDirectory === ""}
      >
        up
      </button>
      <button
        id="navbar-backwards"
        className="navbar-button"
        onClick={() => {
          dispatch({ type: "back" });
        }}
        disabled={state.navigatedIndex === 0}
      >
        back
      </button>
      <button
        onClick={() => {
          dispatch({ type: "forwards" });
        }}
        id="navbar-forwards"
        className="navbar-button"
        disabled={
          state.navigatedIndex === state.navigatedDirectories.length - 1
        }
      >
        forwards
      </button>
    </div>
  );
}
