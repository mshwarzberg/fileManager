import React, { useContext } from "react";
import ButtonNavigation from "./Navigation/ButtonNavigation";
import { DirectoryContext } from "../Main/App";
import { restoreFromTrash } from "../../Helpers/FS and OS/HandleTrash";

const fs = window.require("fs");

export default function Navbar({ selectedItems, setPopup }) {
  const {
    state: { currentDirectory },
    setSettings,
    settings,
    directoryItems,
    setDirectoryItems,
  } = useContext(DirectoryContext);

  return (
    <div id="navbar">
      <button
        id="toggle-directory-tree"
        onClick={() => {
          setSettings((prevSettings) => ({
            ...prevSettings,
            showDirectoryTree: !prevSettings.showDirectoryTree,
          }));
        }}
      >
        {settings.showDirectoryTree ? "Hide" : "Show"} Tree
      </button>
      <ButtonNavigation />
      {currentDirectory === "Trash" ? (
        <>
          <button
            onClick={() => {
              setDirectoryItems(
                restoreFromTrash(
                  JSON.parse(localStorage.getItem("trash")) || []
                )
              );
            }}
            disabled={directoryItems.length === 0}
          >
            Restore All
          </button>
          <button
            onClick={() => {
              const trashedItems =
                JSON.parse(localStorage.getItem("trash")) || [];
              setPopup({
                show: true,
                body: (
                  <div id="body">
                    Deleted items cannot be recovered. Are you sure you want to
                    delete these {trashedItems.length} items?
                  </div>
                ),
                ok: (
                  <button
                    onClick={() => {
                      for (const trashedItem of trashedItems) {
                        if (trashedItem.isDirectory) {
                          fs.rmdirSync(trashedItem.path, { recursive: true });
                        } else {
                          fs.unlinkSync(trashedItem.path);
                        }
                      }
                      localStorage.setItem("trash", "[]");
                      setDirectoryItems([]);
                      setPopup({});
                    }}
                  >
                    Delete
                  </button>
                ),
                cancel: (
                  <button
                    onClick={() => {
                      setPopup({});
                    }}
                  >
                    Cancel
                  </button>
                ),
              });
            }}
            disabled={directoryItems.length === 0}
          >
            Empty Trash
          </button>
        </>
      ) : (
        <h1 id="current-directory-header">{currentDirectory}</h1>
      )}

      <h1 id="directory-items-count">
        {directoryItems.length} items{" "}
        {selectedItems.length === 1 && "(1 selected)"}
        {selectedItems.length > 1 && `(${selectedItems.length} selected)`}
      </h1>
    </div>
  );
}
