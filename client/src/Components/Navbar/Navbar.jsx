import React from "react";
import DirectoryNavigation from "./DirectoryManagement/DirectoryNavigation";
import SortBy from "./Sorting/SortBy";

function Navbar(props) {
  const { setItemsInDirectory } = props;

  return (
    <nav id="navbar--component">
      <DirectoryNavigation />
      <SortBy setItemsInDirectory={setItemsInDirectory} />
    </nav>
  );
}

export default Navbar;
