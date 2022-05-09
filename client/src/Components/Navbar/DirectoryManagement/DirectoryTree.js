import React, { useContext, useState } from "react";
import { DirectoryContext } from "../../../App";
function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);

  const { state } = useContext(DirectoryContext);

  const treeManagement = [
    "DESKTOP",
    {
      DOWNLOADS: [
        "CalculatorMobile",
        {
          FanControl: [
            ".github",
            "Images",
            "Plugins"
          ]
        },
        {
          FIleManager: [
            "client",
            "node-modules",
            "rootDir",
            "routes",
            "thumbnails",
          ]
        }
      ]
    },
    "MUSIC",
    {
      Pictures: [
        "Camera Roll",
        {
          Programming: [
            "Python",
            "React"
          ]
        },
        "Saved Pictures",
        "UbisoftConnect",
        "Uplay"
      ]
    },
    "VIDEOS",
    "MY DATA (A)", 
    "LOCALDISK (B)",
    "LOCALDISK (C)",
    "LOCALDISK (D)"
  ] ;
  
  function mapDirectoryTreeLoop(itemsToMap) {
    let returnKey;
    let key
    for (key in itemsToMap) {
      returnKey = key;
      const listOfDirs = itemsToMap[key].map((subItemsToMap) => {
        if (typeof subItemsToMap === "string") {
          return <p className="directory--tree-directory">{subItemsToMap}</p>;
        } else {
          return mapDirectoryTreeLoop(subItemsToMap)
        }
      });
      return (
        <div id="directory--tree-directories">
          <h1 id="directory--tree-parent-directory">{returnKey}</h1>
          {listOfDirs}
        </div>
      );
    }
  }

  function renderTree() {
    let render = treeManagement.map(item => {
      if (typeof item === 'string') {
        return <p className="directory--tree-directory">{item}</p>
      } else {
        return mapDirectoryTreeLoop(item)
      }
    })
    
    return (
      <div id="">
        <h1 id="directory--tree-parent-directory">./rootDir</h1>
        {render}
      </div>
    );
  }

  return (
    <div id="directory--tree">
      <button
        id="directorytree--button-showhide"
        onClick={() => {
          setShowTree(!showTree);
        }}
      >
        {showTree ? "Hide Tree" : "Show Tree"}
      </button>
      {showTree && <div id="directorytree--body">{renderTree()}</div>}
    </div>
  );
}

export default DirectoryTree;
