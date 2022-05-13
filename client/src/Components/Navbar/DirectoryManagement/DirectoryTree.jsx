import React, { useCallback, useContext, useEffect, useState } from "react";
import { DirectoryStateContext } from "../../../App";
import RandomChars from "../../../Helpers/RandomChars";

export default function DirectoryTree() {
  const [directoryTree, setDirectoryTree] = useState([
   
  ]);

  const [showTree, setShowTree] = useState(false);
  const [data, setData] = useState();

  const { state, dispatch } = useContext(DirectoryStateContext);

  const changeItem = useCallback((tree, array, currentIndex, newValue) => {
    for (let i in tree) {
      if (tree[i][0] === array[currentIndex]) {
        tree[i] = changeItem(tree[i], array, currentIndex + 1, newValue);
      }
    }
    if (currentIndex === array.length - 1) {
      for (let i in tree) {
        if (tree[i] === array[array.length - 1]) {
          tree.splice(tree.indexOf(array[currentIndex]), 1, [
            array[currentIndex],
            ...newValue,
          ]);
        }
      }
    }
    return tree;
  }, []);
  
  useEffect(() => {
    if (data) {
      fetch("/api/getdirectories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: data.path }),
      })
        .then(async (res) => {
          const response = await res.json();
          setDirectoryTree((prevTree) => {
            let newTree = prevTree;
            newTree = changeItem(
              directoryTree,
              data.directoryArray,
              0,
              response.array
            );
            return newTree;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    let dump = directoryTree
    setDirectoryTree(dump)
  }, [
    state.currentDirectory,
    changeItem,
    data,
    directoryTree,
    setDirectoryTree,
  ]);

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
      }
      if (typeof subItem === "string") {
        if (tree.indexOf(subItem) === 0) {
          return "";
        }
        return (
          <p
            key={RandomChars()}
            onClick={(e) => {
              let parentDirs = [];
              if (addToStr) {
                parentDirs = addToStr.split("/");
              }

              parentDirs.push(subItem);
              setData({
                directoryArray: parentDirs,
                path: `./root/${addToStr}/${subItem}`,
              });
              dispatch({type: "openDirectory", value: `./root/${addToStr}/${subItem}`});
            }}
            style={{ marginLeft: `${margin * 5}px` }}
            className="directory--tree-directory"
            
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p id="directory--tree-parent-directory">{openDirName}</p>
        {openDirectory}
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
          {mapDirectoryTreeLoop(directoryTree, 0, "")}
        </div>
      )}
    </div>
  );
}
