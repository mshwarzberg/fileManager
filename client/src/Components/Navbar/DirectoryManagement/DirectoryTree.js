import React, { useState, useContext } from "react";
import {DirectoryContext} from '../../../App'

function DirectoryTree() {
  const {currentDir} = useContext(DirectoryContext)

  const [showTree, setShowTree] = useState(false);
  return (
    <div id="directory--tree">
      <button
        id="directorytree--button-showhide"
        onClick={() => {
          setShowTree(!showTree);
        }}
      >
        Show Tree
      </button>
      {showTree && (
        <div id="directorytree--body">
          <h1 id="directory--tree-current-directory">{currentDir}</h1>
        </div>
      )}
    </div>
  );
}

export default DirectoryTree;
