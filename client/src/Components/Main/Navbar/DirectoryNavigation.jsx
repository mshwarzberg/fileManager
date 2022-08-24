import React, { useContext } from "react";
import { GeneralContext } from "../App";

import forwards from "../../../Assets/images/navigation/forwardshover.png";
import backwards from "../../../Assets/images/navigation/backwardshover.png";
import upwards from "../../../Assets/images/navigation/upwardshover.png";

function DirectoryNavigation() {
  const { state, dispatch, controllers } = useContext(GeneralContext);

  return (
    <div id="navbar--navigation">
      <button
        onClick={() => {
          for (let i in controllers) {
            controllers[i].abort();
          }
          let uppedDirectory = state.currentDirectory.slice(
            0,
            state.currentDirectory.length - 2
          );
          if (uppedDirectory.length === 3) {
            uppedDirectory = "";
          } else {
            for (let i = uppedDirectory.length - 1; i >= 0; i--) {
              if (uppedDirectory[i] === "/") {
                uppedDirectory = uppedDirectory.slice(0, i + 1);
                break;
              }
            }
          }
          dispatch({ type: "upDirectory", value: uppedDirectory });
        }}
        className="navbar--button"
        disabled={state.currentDirectory === ""}
      >
        <img src={upwards} alt="up" />
      </button>
      <button
        id="navbar--backwards"
        className="navbar--button"
        onClick={() => {
          for (let i in controllers) {
            controllers[i].abort();
          }
          dispatch({ type: "backDirectory" });
        }}
        disabled={state.navigatedIndex === 0}
      >
        <img src={backwards} alt="up" />
      </button>
      <button
        onClick={() => {
          for (let i in controllers) {
            controllers[i].abort();
          }
          dispatch({ type: "forwardDirectory" });
        }}
        id="navbar--forwards"
        className="navbar--button"
        disabled={
          state.navigatedIndex === state.navigatedDirectories.length - 1
        }
      >
        <img src={forwards} alt="up" />
      </button>
    </div>
  );
}

export default DirectoryNavigation;
