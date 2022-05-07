import React, { useContext, useState } from "react";
import { DirectoryContext } from "../../../App";

function DirectoryTree() {
  const [showTree, setShowTree] = useState(false);

  const { state } = useContext(DirectoryContext);

  const renderTree = state.directoryTree.map((item, index) => {
    if (item[index]) {
      const renderArrays = item[index].map((arrayItem) => {
        return <p key={arrayItem}>{arrayItem}</p>;
      });
      return <div key={item[index]}>{renderArrays}</div>;
    }
    return "";
  });

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
          <h1 id="directory--tree-current-directory">
            {renderTree[0] ? renderTree : "nothing here"}
          </h1>
        </div>
      )}
    </div>
  );
}

export default DirectoryTree;
