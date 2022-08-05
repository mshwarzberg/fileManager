import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";

export default function DirectoryTree({ showTree }) {
  const { state } = useContext(GeneralContext);

  function mapDirectoryTreeLoop(tree) {
    let parentDirectoryName;
    const childDirectories = tree.map((child) => {
      if (tree.indexOf(child) === 0) {
        parentDirectoryName = child.name;
        return "";
      }
      if (child[0]) {
        return mapDirectoryTreeLoop(child);
      }
      return <ChildDir child={child} key={child.path} />;
    });

    return (
      <ParentDir parentDir={tree[0] || {}} key={tree.path}>
        {childDirectories}
      </ParentDir>
    );
  }

  return (
    showTree && (
      <div id="directorytree--body">
        {mapDirectoryTreeLoop(state.directoryTree, {})}
        <div id="resize--tree" />
      </div>
    )
  );
}
