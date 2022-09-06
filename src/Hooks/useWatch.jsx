import { useEffect, useContext } from "react";
import { DirectoryContext } from "../Components/Main/App";
import formatMetadata from "../Helpers/FS and OS/GetMetadata";
import {
  removeFromDirectoryTree,
  addToDirectoryTree,
} from "../Helpers/ChangeItemInTree";

const fs = window.require("fs");
const watch = window.require("node-watch");

export default function useWatch() {
  const { state, setDirectoryItems, dispatch } = useContext(DirectoryContext);
  useEffect(() => {
    let watcher;
    if (state.currentDirectory) {
      try {
        watcher = watch(
          state.currentDirectory,
          { recursive: true },
          (event, name) => {
            name = name.replaceAll("\\", "/");
            if (event === "update") {
              const data = fs
                .readdirSync(state.currentDirectory, { withFileTypes: true })
                .map((file) => {
                  if (state.currentDirectory + file.name === name) {
                    return formatMetadata(
                      file,
                      state.currentDirectory,
                      state.drive,
                      state.networkDrives.includes(state.drive)
                    );
                  }
                  return {};
                })
                .filter((item) => {
                  return item.name && item;
                });
              setDirectoryItems((prevItems) => [...prevItems, data[0]]);
              if (data[0].isDirectory) {
                // dispatch({
                //   type: "updateDirectoryTree",
                //   value: addToDirectoryTree(
                //     state.directoryTree,
                //     state.currentDirectory,
                //     [{ ...data[0], isPartOfTree: true }]
                //   ),
                // });
              }
            } else if (event === "remove") {
              dispatch({
                type: "updateDirectoryTree",
                value: removeFromDirectoryTree(state.directoryTree, name + "/"),
              });
              setDirectoryItems((prevItems) =>
                prevItems
                  .map((prevItem) => {
                    if (prevItem.path + prevItem.name === name) {
                      return {};
                    }
                    return prevItem;
                  })
                  .filter((prevItem) => prevItem.name && prevItem)
              );
            }
          }
        );
      } catch {}
      return () => {
        watcher?.close();
      };
    }
  }, [state.currentDirectory]);
}
