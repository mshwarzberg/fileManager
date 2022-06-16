import React, { useContext } from "react";
import DirectoryNavigation from "../../Tools/DirectoryNavigation";
import SortBy from "../../Tools/Sorting/SortBy";
import { DirectoryContext } from "../App";

function Navbar() {
  const { state, directoryItems } = useContext(DirectoryContext);

  return (
    <nav id="navbar--component">
      <DirectoryNavigation />
      <SortBy />
      <div id="navbar--dir-info">
        <h1>{state.currentDirectory || "Computer:"}</h1>
        <h1>{directoryItems?.length || 0} items loaded</h1>
      </div>
    </nav>
  );
}

export default Navbar;
