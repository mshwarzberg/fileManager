import React, { useContext } from "react";
import { DirectoryStateContext } from "../../../App";

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
          dispatch({type: "upDirectory", value: uppedDirectory});
        }}
        className="navbar--button"
        disabled={state.currentDirectory === "./root"}
      >
        ↑
      </button>
      <button
        id="navbar--backwards"
        className="navbar--button"
        onClick={() => {
          dispatch({type:"backDirectory"});
        }}
        disabled={state.navigatedIndex === 0}
      >
        ←
      </button>
      <button
        onClick={() => {
          dispatch({type: "forwardDirectory"});
        }}
        id="navbar--forwards"
        className="navbar--button"
        disabled={
          state.navigatedIndex ===
          state.navigatedDirectories.length - 1
        }
      >
        →
      </button>
    </div>
  );
}

export default DirectoryNavigation;
