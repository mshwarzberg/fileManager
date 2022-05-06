import React from "react";
import DirectoryNavigation from "./DirectoryManagement/DirectoryNavigation";
import SortBy from "./Sorting/SortBy";
import DirectoryTree from "./DirectoryManagement/DirectoryTree";

function Navbar(props) {
  const {
    itemsInDirectory,
    setItemsInDirectory,
    navigatedDirs,
    setNavigatedDirs,
  } = props;
  
  return (
    <nav id="navbar--component">
      <DirectoryTree itemsInDirectory={itemsInDirectory} setItemsInDirectory={setItemsInDirectory}/>
      <DirectoryNavigation
        navigatedDirs={navigatedDirs}
        setNavigatedDirs={setNavigatedDirs}
      />
      <SortBy setItemsInDirectory={setItemsInDirectory} />
    </nav>
  );
}

export default Navbar;
