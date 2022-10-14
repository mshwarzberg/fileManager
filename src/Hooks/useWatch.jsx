import { useEffect, useContext } from "react";
import { DirectoryContext } from "../Components/Main/App";
import formatMetadata from "../Helpers/FS and OS/GetMetadata";
import {
  addToDirectoryTree,
  removeFromDirectoryTree,
} from "../Helpers/ChangeItemInTree";
import { findInArray } from "../Helpers/SearchArray";

const fs = window.require("fs");
const watch = window.require("node-watch");

export default function useWatch() {
  const { state, setDirectoryItems, dispatch, directoryItems } =
    useContext(DirectoryContext);
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
                .readdirSync(state.currentDirectory, {
                  withFileTypes: true,
                })
                .map((file) => {
                  if (state.currentDirectory + file.name === name) {
                    return formatMetadata(
                      file,
                      state.currentDirectory,
                      state.drive,
                      state.networkDrives.includes(state.drive)
                    );
                  }
                  return null;
                })
                .filter((item) => item && item)[0];
              if (!data) {
                return;
              }
              if (!findInArray(directoryItems, data.name, "name")) {
                setDirectoryItems((prevItems) => [...prevItems, data]);
              } else {
                setDirectoryItems((prevItems) =>
                  prevItems.map((prevItem) => {
                    if (prevItem.name === data.name) {
                      return data;
                    }
                    return prevItem;
                  })
                );
              }
            } else if (event === "remove") {
              setDirectoryItems((prevItems) =>
                prevItems
                  .map((prevItem) => {
                    if (prevItem.path === name) {
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
