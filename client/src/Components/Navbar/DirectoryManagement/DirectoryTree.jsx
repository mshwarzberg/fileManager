import React, { useContext, useState } from "react";
import { DirectoryStateContext } from "../../../App";
import RandomChars from "../../../Helpers/RandomChars";
import DownArrow from "../../../Assets/images/down-arrow.png";
import RightArrow from "../../../Assets/images/right-arrow.png";

export default function DirectoryTree() {
  
  const [showTree, setShowTree] = useState(false);

  const { state, dispatch } = useContext(DirectoryStateContext);

  function mapDirectoryTreeLoop(tree, margin, path) {
    margin = margin + 1;
    let openDirName = path;
    let openDirectory;
    
    openDirectory = tree.map((subItem) => {
      if (tree.indexOf(subItem) === 0 && typeof subItem === "string") {
        openDirName = subItem;
      }
      let addToStr = `${path}/${openDirName}`;
      if (path === "") {
        addToStr = openDirName;
        if (addToStr === 'root') {
          [addToStr, openDirName] = ''
        }
      }
      if (typeof subItem === "string") {
        if (tree.indexOf(subItem) === 0) {
          return "";
        }
        return (
          <p
            key={RandomChars()}
            onClick={() => {
              let parentDirs = [];
              if (addToStr) {
                parentDirs = addToStr.split("/");
              }

              parentDirs.push(subItem);
              dispatch({
                type: "openDirectory",
                value: `./root/${addToStr}/${subItem}`,
                array: ['abc', 'def', 'ghi']
              });
            }}
            style={{ marginLeft: `${margin * 5}px` }}
            className="directorytree--directory"
          >
            {subItem}
          </p>
        );
      } else {
        return mapDirectoryTreeLoop(subItem, margin, addToStr);
      }
    });
    return (
      <div
        key={RandomChars()}
        style={{
          marginLeft: `${margin * 5}px`,
        }}
        className="directorytree--expanded-directory"
      >
        <div className="line--down" />
        <p className="directorytree--parent-directory">
          <img
            onClick={(e) => {
              if (e.target.parentElement.nextSibling.style.display === "") {
                e.target.parentElement.nextSibling.style.display = "none";
                e.target.src = RightArrow;
              } else {
                e.target.parentElement.nextSibling.style.display = "";
                e.target.src = DownArrow;
              }
            }}
            className="directorytree-parent-down"
            src={DownArrow}
            alt=""
          />
          {openDirName}
        </p>
        <div className="directorytree--open-directories">{openDirectory}</div>
      </div>
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
