import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree({ showTree }) {
  const { state } = useContext(GeneralContext);

  function mapDirectoryTreeLoop(tree, path) {
    let parentDirectoryName;
    let newPath = path;
    let parentDirectory = tree.map((subItem) => {
      newPath = path;
      if (tree.indexOf(subItem) === 0) {
        parentDirectoryName = subItem;
        return "";
      }
      if (typeof subItem === "object") {
        newPath += subItem[0] + "/";
        return mapDirectoryTreeLoop(subItem, newPath);
      }
      newPath += subItem;
      return <ChildDir subItem={subItem} path={newPath} key={path + subItem} />;
    });
    path = path.slice(0, path.length - 1);
    return (
      <ParentDir
        path={path}
        parentDirectoryName={parentDirectoryName}
        parentDirectory={parentDirectory}
        key={path}
      />
    );
  }

  return (
    showTree && (
      <div id="directorytree--body">
        {mapDirectoryTreeLoop(state.directoryTree, "")}
        <div id="resize--tree" />
      </div>
    )
  );
}
