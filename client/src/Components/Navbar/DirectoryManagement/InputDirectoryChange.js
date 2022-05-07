import React, { useContext, useEffect, useState } from "react";
import { DirectoryContext } from "../../../App";
import folderIconForNavbar from "../../../Assets/images/folder.png";

function InputDirectoryChange(props) {
  const { state, setAction, setDirectory } = useContext(DirectoryContext);

  const [searchBarDir, setSearchBarDir] = useState(state.currentDirectory);

  useEffect(() => {
    function submitNewDirectory(e) {
      let originalDir = state.currentDirectory
      if (e.key === "Enter") {
        setDirectory('InputDirectoryChange', [searchBarDir, originalDir])
      }
    }
    document.addEventListener("keydown", submitNewDirectory);

    return () => {
      document.removeEventListener("keydown", submitNewDirectory);
    };
  });

  useEffect(() => {
    setSearchBarDir(state.currentDirectory);
  }, [state.currentDirectory]);

  return (
    <div
      id={
        props.notFoundError
          ? "inputdirectory--error"
          : "inputdirectory--directory"
      }
    >
      <img
        title="Go back to root folder"
        src={folderIconForNavbar}
        alt="folder"
        id="inputdirectory--image"
        onClick={() => {
          setDirectory("InputDirectoryChange")
        }}
      />
      <input
        id="inputdirectory--input"
        type="text"
        value={`${searchBarDir}`}
        onChange={(e) => {
          setSearchBarDir(e.target.value);
        }}
      />
      <h1 id="inputdirectory--items-loaded">
        {props.itemsInDirectory.length} items loaded
      </h1>
    </div>
  );
}

export default InputDirectoryChange;
