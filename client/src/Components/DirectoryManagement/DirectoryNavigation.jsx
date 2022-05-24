import React, { useContext } from "react";
import { DirectoryStateContext } from "../../App";

import forwards from "../../Assets/images/navigation/forwardshover.png";
import backwards from "../../Assets/images/navigation/backwardshover.png";
import upwards from "../../Assets/images/navigation/upwardshover.png";

function DirectoryNavigation() {
  const { state, dispatch } = useContext(DirectoryStateContext);

  return (
    <div id="navbar--navigation">
      <button
        onClick={() => {
          let uppedDirectory = state.currentDirectory;
          for (let i = uppedDirectory.length - 2; i > 0; i--) {
            if (uppedDirectory[i] === "/") {
              uppedDirectory = uppedDirectory.slice(0, i);
              break;
            }
          }
          dispatch({ type: "upDirectory", value: uppedDirectory });
        }}
        className="navbar--button"
        disabled={state.currentDirectory === "./root"}
      >
        <img src={upwards} alt="up" />
      </button>
      <button
        id="navbar--backwards"
        className="navbar--button"
        onClick={() => {
          dispatch({ type: "backDirectory" });
        }}
        disabled={state.navigatedIndex === 0}
      >
        <img src={backwards} alt="up" />
      </button>
      <button
        onClick={() => {
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
