import React, { useContext, useState, useRef } from "react";
import { DirectoryContext } from "../../Main/App";
import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);
  const { state } = useContext(DirectoryContext);

  const treeID = useRef();
  const treeBody = useRef();

  function mapDirectoryTreeLoop(tree, path) {
    let parentDirectoryName;
    let newPath = path;
    let parentDirectory = tree.map((subItem) => {
      if (tree.indexOf(subItem) === 0) {
        parentDirectoryName = subItem;
        return "";
      }
      newPath = path;
      if (subItem === "") {
        return "";
      }
      if (typeof subItem === "object") {
        newPath += subItem[0] + "/";
        return mapDirectoryTreeLoop(subItem, newPath);
      }
      newPath += subItem;
      return (
        <ChildDir
          treeID={treeID}
          subItem={subItem}
          path={newPath}
          key={path + subItem}
        />
      );
    });
    path = path.slice(0, path.length - 1);
    return (
      <ParentDir
        treeID={treeID}
        path={path}
        parentDirectoryName={parentDirectoryName}
        parentDirectory={parentDirectory}
        key={path}
      />
    );
  }
  mapDirectoryTreeLoop(state.directoryTree, "/");

  return (
    <>
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
        <div ref={treeBody}>
          <div id="directorytree--body" ref={treeID}>
            {/* {mapDirectoryTreeLoop(state.directoryTree, "/")} */}
          </div>
          <div id="resize--tree" />
        </div>
      )}
    </>
  );
}
