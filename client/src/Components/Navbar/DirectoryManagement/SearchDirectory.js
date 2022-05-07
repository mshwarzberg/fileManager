import React, { useContext, useEffect, useState } from "react";
import { DirectoryContext } from "../../../App";
import folderIconForNavbar from "../../../Assets/images/folder.png";

function SearchDirectory(props) {
  const { state, setDirectory } = useContext(DirectoryContext);

  const [searchBarDir, setSearchBarDir] = useState(state.currentDirectory);

  useEffect(() => {
    function submitNewDirectory(e) {
      let originalDir = state.currentDirectory
      if (e.key === "Enter") {
        setDirectory('enterFolder', searchBarDir) 
        console.log(props);
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
          setDirectory("SearchDirectory")
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

export default SearchDirectory;
