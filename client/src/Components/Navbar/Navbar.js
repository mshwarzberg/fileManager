import React, { useContext } from "react";
import folderIconForNavbar from "../../Assets/images/navfolder.png";
import FolderNavigation from "./FolderNavigation";
import { DirectoryContext } from "../../App";

function Navbar() {
  
  const { currentDir } = useContext(DirectoryContext);

  return (
    <nav id="navbar--component">
      <FolderNavigation />
      <h1 id="navbar--current-directory">
        <img src={folderIconForNavbar} alt="folder" />
        &nbsp;{currentDir}
      </h1>
    </nav>
  );
}

export default Navbar;
