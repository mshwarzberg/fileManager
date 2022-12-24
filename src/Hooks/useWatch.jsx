import { useEffect, useContext } from "react";
import { GeneralContext } from "../Components/Main/Main.tsx";
import formatMetadata from "../Helpers/FS and OS/FormatMetadata";
import { findInArray } from "../Helpers/SearchArray";

const fs = window.require("fs");

export default function useWatch() {
  const {
    state: { currentDirectory, drive },
    setDirectoryItems,
    directoryItems,
  } = useContext(GeneralContext);

  function getData(path) {
    return fs
      .readdirSync(currentDirectory, {
        withFileTypes: true,
      })
      .map((file) => {
        if (currentDirectory + file.name === path) {
          return formatMetadata(file, currentDirectory, drive);
        }
        return null;
      })
      .filter((item) => item && item)[0];
  }
  function handleChange(typeOfChange, path) {
    if (typeOfChange === "update") {
      const data = getData();
      setDirectoryItems((prevItems) =>
        prevItems.map((prevItem) => {
          if (prevItem.name === data.name) {
            return data;
          }
          return prevItem;
        })
      );
    }
    if (typeOfChange === "delete") {
      setDirectoryItems((prevItems) =>
        prevItems
          .map((prevItem) => {
            if (prevItem.path === path) {
              if (prevItem.isMedia) {
                try {
                  fs.unlinkSync(currentDirectory + "$Thumbs$/" + path);
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

  useEffect(() => {
    let watcher;
    if (currentDirectory) {
      try {
        for (const { path } of directoryItems) {
          fs.watchFile(path, { interval: 100 }, (current, _previous) => {
            if (current.birthtimeMs) {
              handleChange("update", path);
            } else {
              handleChange("delete", path);
            }
          });
        }
        watcher = fs.watch(currentDirectory, (event, fileName) => {
          if (event === "rename") {
            if (!findInArray(directoryItems, fileName, "name")) {
              setDirectoryItems((prevItems) => [
                ...prevItems,
                getData(currentDirectory + fileName),
              ]);
            }
          }
        });
      } catch {}

      return () => {
        for (const { path } of directoryItems) {
          fs.unwatchFile(path);
        }
        watcher?.close();
      };
    }
  }, [currentDirectory, directoryItems]);
}
