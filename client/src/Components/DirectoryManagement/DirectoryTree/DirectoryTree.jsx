import React, { useContext, useState, useRef, useEffect } from "react";
import { DirectoryStateContext } from "../../../App";

import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);
  const [treeWidth, setTreeWidth] = useState();
  const [isDragging, setIsDragging] = useState(false);
  
  function HoverOverPathID(path, isHovering) {
    let children = document.querySelectorAll(path);
    children.forEach((child) => {
      child.childNodes.forEach((lineAndCurve) => {
        lineAndCurve.style.backgroundColor = isHovering ? "#d6fd92" : "red";
      });
    });
  }

  useEffect(() => {
    const grab = document.querySelector("#resize--tree");
    function handleDrag(e) {
      if (isDragging) {
        setTreeWidth(e.x);
      }
    }
    if (grab) {
      document.addEventListener("mouseup", () => {
        setIsDragging(false);
      });
      document.addEventListener("mousemove", handleDrag);

      return () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", () => {});
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
        if (addToPath === "") {
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
            key={`${addToPath && "/" + addToPath}/${subItem}`}
            HoverOverPathID={HoverOverPathID}
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
        key={`${path && "/" + path}/${openDirectoryName}`}
        HoverOverPathID={HoverOverPathID}
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
            onMouseDown={() => {
              setIsDragging(true);
            }}
          />
        </>
      )}
    </div>
  );
}
