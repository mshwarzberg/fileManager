import React, { useContext } from "react";

import { DirectoryContext } from "../../App";

function FolderNavigation() {

  const { currentDir, setCurrentDir } = useContext(DirectoryContext);

  return (
    <div id="navbar--navigation">
      <button
      id="navbar--backwards"
        className="navbar--button"
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
        disabled={currentDir === "./rootDir"}
      >
        ←
      </button>
      <button
        id="navbar--forwards"
        className="navbar--button"
        disabled={true}
      >
        →
      </button>
    </div>
  )
}

export default FolderNavigation