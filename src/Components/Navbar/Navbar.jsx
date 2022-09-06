import React, { useContext } from "react";
import ButtonNavigation from "./Navigation/ButtonNavigation";
import { DirectoryContext } from "../Main/App";

export default function Navbar() {
  const { state, setSettings, settings, directoryItems } =
    useContext(DirectoryContext);

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
        {settings.showDirectoryTree ? "Hide" : "Show"} Folder Tree
      </button>
      <ButtonNavigation />
      <h1 id="current-directory-header">{state.currentDirectory}</h1>
      <h1 id="directory-items-count">{directoryItems.length} items</h1>
    </div>
  );
}
