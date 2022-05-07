import React from "react";
import DirectoryNavigation from "./DirectoryManagement/DirectoryNavigation";
import SortBy from "./Sorting/SortBy";
import DirectoryTree from "./DirectoryManagement/DirectoryTree";

function Navbar(props) {
  const { itemsInDirectory, setItemsInDirectory } = props;

  return (
    <nav id="navbar--component">
      <DirectoryTree
        itemsInDirectory={itemsInDirectory}
        setItemsInDirectory={setItemsInDirectory}
      />
      <DirectoryNavigation />
      <SortBy setItemsInDirectory={setItemsInDirectory} />
    </nav>
  );
}

export default Navbar;
