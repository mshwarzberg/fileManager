import React from "react";
import DirectoryNavigation from "../DirectoryManagement/DirectoryNavigation";
import SortBy from "./Sorting/SortBy";

function Navbar(props) {
  const { setDirectoryItems } = props;

  return (
    <nav id="navbar--component">
      <DirectoryNavigation />
      <SortBy setDirectoryItems={setDirectoryItems} />
    </nav>
  );
}

export default Navbar;
