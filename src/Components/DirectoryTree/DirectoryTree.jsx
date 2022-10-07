import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import ChildDirectory from "./ChildDirectory";
import ParentDirectory from "./ParentDirectory";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import randomID from "../../Helpers/RandomID";

const fs = window.require("fs");
const { execSync } = window.require("child_process");

export default function DirectoryTree() {
  const { state, settings, dispatch } = useContext(DirectoryContext);

  useEffect(() => {
    async function updateTree() {
      const drives = await formatDriveOutput();
      if (state.directoryTree[0]) {
        const driveNames = drives.map((drive) => drive.path);
        const directoryTreeDriveNames = state.directoryTree
          .map((item) => item.path || item[0]?.path)
          .filter((item) => item && item);

        const newDrives = [];
        const removedDrives = [];

        for (const driveName of driveNames) {
          if (!directoryTreeDriveNames.includes(driveName)) {
            newDrives.push(drives[driveNames.indexOf(driveName)]);
          }
        }
        for (const directoryTreeDriveName of directoryTreeDriveNames) {
          if (
            !driveNames.includes(directoryTreeDriveName) &&
            directoryTreeDriveName.length === 3
          ) {
            removedDrives.push(directoryTreeDriveName);
          }
        }
        function getPath(item) {
          return item.path || item[0]?.path;
        }
        const updatedDrives = state.directoryTree
          .map((item) => {
            if (removedDrives.includes(item.path || item[0]?.path)) {
              return {};
            }
            return item;
          })
          .slice(7, Infinity)
          .sort((a, b) => {
            return getPath(a)?.length - getPath(b)?.length;
          });

        dispatch({
          type: "updateDirectoryTree",
          value: [
            ...state.directoryTree.slice(0, 7),
            ...updatedDrives,
            ...newDrives,
          ],
        });
        return;
      }
      const username = execSync("echo %username%").toString().split("\r")[0];
      let defaultTree = drives;
      if (username) {
        const directories = [
          "Videos",
          "Pictures",
          "Music",
          "Downloads",
          "Documents",
          "Desktop",
        ];

        for (let directory of directories) {
          defaultTree.unshift({
            name: directory,
            path: `C:/Users/${username}/${directory}/`,
            permission: true,
            type: "default",
            isDirectory: true,
            collapsed: true,
          });
        }
      }

      dispatch({
        type: "updateDirectoryTree",
        value: [
          { collapsed: false, permission: true, isRoot: true },
          ...defaultTree,
        ],
      });
    }
    updateTree();
  }, [state.currentDirectory]);

  function containsDirectories(path) {
    try {
      return fs
        .readdirSync(path, { withFileTypes: true })
        .map((item) => item.isDirectory())
        .includes(true);
    } catch {
      return false;
    }
  }

  function mapDirectoryTreeLoop(tree = state.directoryTree, parentTree = {}) {
    const childDirectories = tree.map((child, index) => {
      if (index === 0) {
        return "";
      }
      if (child[0]) {
        return mapDirectoryTreeLoop(child, tree);
      }

      return (
        child.path && (
          <ChildDirectory
            childDir={child}
            key={randomID()}
            containsDirectories={containsDirectories(child.path)}
          />
        )
      );
    });

    return (
      (tree[0].path || tree[0].isRoot) && (
        <ParentDirectory
          parentDir={tree[0] || {}}
          key={randomID()}
          childDirsList={tree}
        >
          {childDirectories}
        </ParentDirectory>
      )
    );
  }

  return (
    settings.showDirectoryTree && (
      <>
        <div
          id="directory-tree"
          style={{
            flex: `0 0 ${settings.treeWidth}px`,
          }}
        >
          {mapDirectoryTreeLoop()}
        </div>
        <div id="directory-tree-scaler" />
      </>
    )
  );
}
