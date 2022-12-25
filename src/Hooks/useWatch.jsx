import { useEffect, useContext } from "react";
import { GeneralContext } from "../Components/Main/Main";
import formatMetadata from "../Helpers/FS and OS/FormatMetadata";
import { findInArray } from "../Helpers/SearchArray";

const fs = window.require("fs");

export default function useWatch() {
  const {
    state: { currentDirectory, drive },
    setDirectoryContent,
    directoryContent,
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
      if (!data) {
        return;
      }
      setDirectoryContent((prevItems) =>
        prevItems.map((prevItem) => {
          if (prevItem.name === data.name) {
            return data;
          }
          return prevItem;
        })
      );
    }
    if (typeOfChange === "delete") {
      setDirectoryContent((prevItems) =>
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
        for (const { path } of directoryContent) {
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
            if (!findInArray(directoryContent, fileName, "name")) {
              setDirectoryContent((prevItems) => [
                ...prevItems,
                getData(currentDirectory + fileName),
              ]);
            }
          }
        });
      } catch {}

      return () => {
        for (const { path } of directoryContent) {
          fs.unwatchFile(path);
        }
        watcher?.close();
      };
    }
  }, [currentDirectory, directoryContent]);
}
