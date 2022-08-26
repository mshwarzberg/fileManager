import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";
import Files from "./Files";
import alternateImage from "../../../Helpers/AlternateTreeImage";

export default function DirectoryTree({ showTree }) {
  const { state } = useContext(GeneralContext);

  function mapDirectoryTreeLoop(tree, parentTree) {
    const childDirectories = tree.map((child, index) => {
      if (index === 0) {
        return "";
      }
      if (child[0]) {
        return mapDirectoryTreeLoop(child, tree);
      }
      if (child.isFile) {
        return <Files child={child} key={child.path} />;
      }

      return (
        <ChildDir
          child={child}
          key={child.path}
          altImage={(name) => {
            return alternateImage(
              name,
              tree[0]?.isRoot || parentTree[0].isRoot
            );
          }}
        />
      );
    });

    return (
      <ParentDir
        parentDir={tree[0] || {}}
        key={tree[0].path || "This PC"}
        altImage={(name) => {
          return alternateImage(name, tree[0]?.isRoot || parentTree[0].isRoot);
        }}
      >
        {childDirectories}
      </ParentDir>
    );
  }

  return (
    showTree && (
      <>
        <div
          id="directorytree--body"
          style={{
            flex: `0 0 ${
              localStorage.getItem("directoryTreeWidth") || "450"
            }px`,
          }}
        >
          {mapDirectoryTreeLoop(state.directoryTree, {})}
          <div id="resize--tree" />
        </div>
        <div id="split-main-page" />
      </>
    )
  );
}
