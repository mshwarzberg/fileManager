import { useEffect, useContext } from "react";
import { GeneralContext } from "../Components/Main/App.jsx";
import formatMetadata from "../Helpers/FS and OS/FormatMetadata";
import { findInArray } from "../Helpers/SearchArray";

const fs = window.require("fs");
const watch = window.require("node-watch");

export default function useWatch() {
  const {
    state: { currentDirectory, drive },
    setDirectoryItems,
    directoryItems,
  } = useContext(GeneralContext);
  useEffect(() => {
    let watcher;
    if (currentDirectory) {
      try {
        watcher = watch(
          currentDirectory,
          { recursive: true },
          (event, name) => {
            name = name.replaceAll("\\", "/");
            if (event === "update") {
              const data = fs
                .readdirSync(currentDirectory, {
                  withFileTypes: true,
                })
                .map((file) => {
                  if (currentDirectory + file.name === name) {
                    return formatMetadata(file, currentDirectory, drive);
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
                      if (prevItem.isMedia) {
                        try {
                          fs.unlinkSync(currentDirectory + "$Thumbs$/" + name);
                        } catch (error) {}
                      }
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
  }, [currentDirectory, directoryItems]);
}
