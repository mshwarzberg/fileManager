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
          HoverOverPathID={HoverOverPathID}
        />
      );
    });

    return (
      <ParentDir
        treeID={treeID}
        path={newPath}
        parentDirectoryName={parentDirectoryName}
        parentDirectory={parentDirectory}
        key={`${path && "/" + path}/${parentDirectoryName}`}
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
            {mapDirectoryTreeLoop(state.directoryTree, "/")}
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
