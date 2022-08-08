import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import ChildDir from "./ChildDir";
import ParentDir from "./ParentDir";
import Files from "./Files";

import {
  Desktop,
  Documents,
  Downloads,
  Music,
  Pictures,
  Videos,
  Drive,
} from "../../../Assets/images/Tree Icons/index";

export default function DirectoryTree({ showTree }) {
  const { state } = useContext(GeneralContext);

  function mapDirectoryTreeLoop(tree, parentTree) {
    function alternateImage(name) {
      if (tree[0]?.isRoot || parentTree[0].isRoot) {
        if (name.includes(":")) {
          return Drive;
        }
        switch (name) {
          case "Downloads":
            return Downloads;
          case "Documents":
            return Documents;
          case "Desktop":
            return Desktop;
          case "Music":
            return Music;
          case "Pictures":
            return Pictures;
          case "Videos":
            return Videos;
          default:
            return;
        }
      }
      return;
    }
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
            return alternateImage(name);
          }}
        />
      );
    });

    return (
      <ParentDir
        parentDir={tree[0] || {}}
        key={tree[0].path || "This PC"}
        altImage={(name) => {
          return alternateImage(name);
        }}
      >
        {childDirectories}
      </ParentDir>
    );
  }

  return (
    showTree && (
      <>
        <div id="directorytree--body">
          {mapDirectoryTreeLoop(state.directoryTree, {})}
          <div id="resize--tree" />
        </div>
        <div id="split-main-page" />
      </>
    )
  );
}
