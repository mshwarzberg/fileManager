import { useContext, useEffect } from "react";
import { GeneralContext } from "../Main/App.jsx";
import ChildDirectory from "./ChildDirectory";
import ParentDirectory from "./ParentDirectory";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import randomID from "../../Helpers/RandomID";

const fs = window.require("fs");
const { execSync, exec } = window.require("child_process");

export default function DirectoryTree() {
  const {
    state: { directoryTree, currentDirectory },
    settings,
    settings: { appTheme },
    dispatch,
  } = useContext(GeneralContext);

  useEffect(() => {
    async function updateTree() {
      exec(
        `wmic LogicalDisk where(DriveType=3) get Name,Size,VolumeName, FreeSpace, FileSystem`,
        (_, data) => {
          const drives = formatDriveOutput(data);
          if (directoryTree[0]) {
            const driveNames = drives.map((drive) => drive.path);
            const directoryTreeDriveNames = directoryTree
              .map((item) => item.path || item[0]?.path)
              .filter((item) => item && item);
            const newDrives = [];
            for (const driveName of driveNames) {
              if (!directoryTreeDriveNames.includes(driveName)) {
                newDrives.push(drives[driveNames.indexOf(driveName)]);
              }
            }
            const updatedDrives = directoryTree.slice(7, Infinity);
            dispatch({
              type: "updateDirectoryTree",
              value: [
                ...directoryTree.slice(0, 7),
                ...updatedDrives,
                ...newDrives,
              ],
            });
            return;
          }
          const username = execSync("echo %username%")
            .toString()
            .split("\r")[0];
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
            for (const directory of directories) {
              defaultTree.unshift({
                name: directory,
                path: `C:/Users/${username}/${directory}/`,
                permission: true,
                isDirectory: true,
                collapsed: true,
              });
            }
            defaultTree.unshift({
              name: "Trash",
              path: "Trash",
              permission: true,
              isDirectory: true,
              collapsed: true,
            });
          }
          dispatch({
            type: "updateDirectoryTree",
            value: [
              { collapsed: false, permission: true, isRoot: true },
              ...defaultTree,
            ],
          });
        }
      );
    }
    updateTree();
  }, [currentDirectory]);

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

  function mapDirectoryTreeLoop(tree = directoryTree) {
    const childDirectories = tree.map((child, index) => {
      if (index === 0) {
        return "";
      }
      if (child[0]) {
        return mapDirectoryTreeLoop(child);
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
          className={`directory-tree-${appTheme}`}
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
