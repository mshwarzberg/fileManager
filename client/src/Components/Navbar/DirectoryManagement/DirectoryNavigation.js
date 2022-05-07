import React, { useContext } from "react";
import { DirectoryContext } from "../../../App";
import useLog from '../../../Hooks/useLog'
function DirectoryNavigation() {
  const { state, setDirectory } = useContext(DirectoryContext);
  useLog(state.navigatedDirectories.index + " index")
  useLog(state.navigatedDirectories.array.length + " array")
  return (
    <div id="navbar--navigation">
      <button
        onClick={() => {
          let newDir = state.currentDirectory;
          for (let i = newDir.length - 2; i > 0; i--) {
            if (newDir[i] === "/") {
              newDir = newDir.slice(0, i);
              break;
            }
          }
          setDirectory("DirectoryNavigation", ["UpFolder", newDir]);
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
          setDirectory("DirectoryNavigation", [
            "BackFolder",
            state.navigatedDirectories.array[
              state.navigatedDirectories.index - 1
            ],
          ]);
        }}
        disabled={state.navigatedDirectories.index === 0}
      >
        ←
      </button>
      <button
        onClick={() => {
          setDirectory("DirectoryNavigation", [
            "ForwardFolder",
            state.navigatedDirectories.array[
              state.navigatedDirectories.index + 1
            ],
          ]);
        }}
        id="navbar--forwards"
        className="navbar--button"
        disabled={
          state.navigatedDirectories.index ===
          state.navigatedDirectories.array.length - 1
        }
      >
        →
      </button>
    </div>
  );
}

export default DirectoryNavigation;
