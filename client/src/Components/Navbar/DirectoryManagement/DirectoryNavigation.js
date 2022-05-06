import React, { useContext } from "react";

import { DirectoryContext } from "../../../App";

function DirectoryNavigation(props) {
  const { currentDir, setCurrentDir } = useContext(DirectoryContext);
  const { navigatedDirs, setNavigatedDirs } = props;

  return (
    <div id="navbar--navigation">
      <button
        onClick={() => {
          setCurrentDir((prevDir) => {
            for (let i = prevDir.length - 2; i > 0; i--) {
              if (prevDir[i] === "/") {
                return prevDir.slice(0, i);
              }
            }
            return prevDir;
          });
        }}
        className="navbar--button"
        disabled={currentDir === "./rootDir"}
      >
        ↑
      </button>
      <button
        id="navbar--backwards"
        className="navbar--button"
        onClick={() => {
          setCurrentDir(navigatedDirs.array[navigatedDirs.index - 1]);
          setNavigatedDirs((prevNavDirs) => ({
            array: [...prevNavDirs.array],
            index: prevNavDirs.index - 1,
          }));
        }}
        disabled={navigatedDirs.index === 0}
      >
        ←
      </button>
      <button
        onClick={() => {
          setCurrentDir(navigatedDirs.array[navigatedDirs.index + 1]);
          setNavigatedDirs((prevNavDirs) => ({
            array: [...prevNavDirs.array],
            index: prevNavDirs.index + 1,
          }));
        }}
        id="navbar--forwards"
        className="navbar--button"
        disabled={navigatedDirs.index === navigatedDirs.array.length - 1}
      >
        →
      </button>
    </div>
  );
}

export default DirectoryNavigation;
