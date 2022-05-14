import React, { useContext, useState } from "react";
import { DirectoryStateContext } from "../../../../App";
import RandomChars from "../../../../Helpers/RandomChars";

import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);

  const { state } = useContext(DirectoryStateContext);

  function mapDirectoryTreeLoop(tree, margin, path) {
    margin = margin + 1;
    let openDirName = path;
    let openDirectory;
    let addToPath

    openDirectory = tree.map((subItem) => {
      if (tree.indexOf(subItem) === 0 && typeof subItem === "string") {
        openDirName = subItem;
      }
      addToPath = `${path}/${openDirName}`;
      if (path === "") {
        addToPath = openDirName;
        if (addToPath === "root") {
          addToPath = "";
          openDirName = "";
        }
      }
      if (typeof subItem === "string") {
        if (tree.indexOf(subItem) === 0) {
          return "";
        }
        return (
          <ChildDir
            subItem={subItem}
            addToPath={addToPath}
            margin={margin}
            key={RandomChars()}
          />
        );
      } else {
        return mapDirectoryTreeLoop(subItem, margin, addToPath);
      }
    });
    return (
      <ParentDir
        path={path}
        openDirName={openDirName}
        margin={margin}
        openDirectory={openDirectory}
        key={RandomChars()}
      />
    );
  }

  return (
    <div>
      <button
        className="navbar--button"
        id="directorytree--button-showhide"
        onClick={() => {
          setShowTree(!showTree);
        }}
      >
        {showTree ? "Hide Tree" : "Show Tree"}
      </button>
      {showTree && (
        <div id="directorytree--body">
          {mapDirectoryTreeLoop(state.directoryTree, 0, "")}
        </div>
      )}
    </div>
  );
}
