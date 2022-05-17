import React, { useContext, useState } from "react";
import { DirectoryStateContext } from "../../../../App";
import RandomChars from "../../../../Helpers/RandomChars";

import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);

  const { state } = useContext(DirectoryStateContext);

  function mapDirectoryTreeLoop(tree, path) {
    let openDirectoryName = path;
    let openDirectory;
    let addToPath

    openDirectory = tree.map((subItem) => {
      if (tree.indexOf(subItem) === 0 && typeof subItem === "string") {
        openDirectoryName = subItem;
      }
      addToPath = `${path}/${openDirectoryName}`;
      if (path === "") {
        addToPath = openDirectoryName;
        if (addToPath === "root") {
          addToPath = "";
          openDirectoryName = "";
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
            key={RandomChars()}
          />
        );
      } else {
        return mapDirectoryTreeLoop(subItem, addToPath);
      }
    });
    return (
      <ParentDir
        path={path}
        openDirectoryName={openDirectoryName}
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
          {mapDirectoryTreeLoop(state.directoryTree, "")}
        </div>
      )}
    </div>
  );
}