import React, { useContext } from "react";
import { DirectoryContext } from "../../../App";

function DirectoryNavigation() {

  const { state, setDirectory } = useContext(DirectoryContext);
  
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
          setDirectory("goUpFolder", uppedDirectory);
        }}
        className="navbar--button"
        disabled={state.currentDirectory === "./rootDir"}
      >
        ↑
      </button>
      <button
        id="navbar--backwards"
        className="navbar--button"
        onClick={() => {
          setDirectory("goBackFolder");
        }}
        disabled={state.arrayIndex === 0}
      >
        ←
      </button>
      <button
        onClick={() => {
          setDirectory("goForwardsFolder");
        }}
        id="navbar--forwards"
        className="navbar--button"
        disabled={
          state.arrayIndex ===
          state.navigatedDirectories.length - 1
        }
      >
        →
      </button>
    </div>
  );
}

export default DirectoryNavigation;
