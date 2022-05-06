import React, { useContext, useEffect, useState } from "react";
import folderIconForNavbar from "../../Assets/images/navfolder.png";

import { DirectoryContext } from "../../App";

function DirectoryChange(props) {
  
  const { currentDir, setCurrentDir, setNavigatedDirs, notFoundError } = useContext(DirectoryContext);
  
  const [searchBarDir, setSearchBarDir] = useState(currentDir);

  useEffect(() => {
    function submitNewDirectory(e) {
      if (e.key === "Enter") {
        setCurrentDir(searchBarDir);
        if (!notFoundError) {
          return setNavigatedDirs(prevNavDirs => ({
            array: [...prevNavDirs.array, currentDir],
            index: prevNavDirs.index + 1
          }))
        }
      }
    }
    document.addEventListener("keydown", submitNewDirectory);

    return () => {
      document.removeEventListener("keydown", submitNewDirectory);
    };
  });

  useEffect(() => {
    setSearchBarDir(currentDir);
  }, [currentDir]);

  return (
    <div
      id={
        props.notFoundError
          ? "main--current-directory-error"
          : "main--current-directory"
      }
    >
      <img
        title="Go back to root folder"
        src={folderIconForNavbar}
        alt="folder"
        id="main--current-directory-image"
        onClick={() => {
          setCurrentDir("./rootDir");
          setNavigatedDirs(prevNavDirs => ({
            array: [...prevNavDirs.array, './rootDir'],
            index: prevNavDirs.index + 1
          }))
        }}
      />
      <input
        className="main--current-directory-text"
        id="main--curent-directory-input"
        type="text"
        value={`${searchBarDir}`}
        onChange={(e) => {
          setSearchBarDir(e.target.value);
        }}
      />
      <h1
        className="main--current-directory-text"
        id="main--curent-directory-items-loaded"
      >
        {props.itemsInDirectory.length} items loaded
      </h1>
    </div>
  );
}

export default DirectoryChange;
