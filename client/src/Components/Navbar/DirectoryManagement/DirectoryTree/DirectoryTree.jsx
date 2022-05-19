import React, { useContext, useState, useRef } from "react";
import { useEffect } from "react";
import { DirectoryStateContext } from "../../../../App";
import RandomChars from "../../../../Helpers/RandomChars";

import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);
  const [treeWidth, setTreeWidth] = useState();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const grab = document.querySelector("#resize--tree");
    function handleDrag(e) {
      if (isDragging) {
        setTreeWidth(e.clientX);
      }
    }
    if (grab) {
      grab.addEventListener("mousedown", () => {
        setIsDragging(true);
      });
      document.addEventListener("mouseup", () => {
        setIsDragging(false);
      });
      document.addEventListener("mousemove", handleDrag);

      document.addEventListener("touchend", (e) => {
        setTreeWidth(e.changedTouches[0].screenX);
      });
      return () => {
        grab.removeEventListener("mousedown", () => {});
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", () => {});
        grab.removeEventListener("touchend", () => {});
      };
    }
  });

  const { state } = useContext(DirectoryStateContext);

  const treeID = useRef();

  function mapDirectoryTreeLoop(tree, path) {
    let openDirectoryName = path;
    let openDirectory;
    let addToPath;
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
            treeID={treeID}
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
        treeID={treeID}
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
        <>
          <div
            id="directorytree--body"
            ref={treeID}
            style={{ width: treeWidth && treeWidth }}
          >
            {mapDirectoryTreeLoop(state.directoryTree, "")}
          </div>
          <div
            id="resize--tree"
            style={{ left: treeWidth && treeWidth - 5 }}
          />
        </>
      )}
    </div>
  );
}
