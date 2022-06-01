import React, {  useContext } from "react";
import DirectoryNavigation from "../../Tools/DirectoryNavigation";
import SortBy from '../../Tools/Sorting/SortBy'
import {DirectoryContext} from '../App'

function Navbar() {
  const { state } = useContext(DirectoryContext) 

  return (
    <nav id="navbar--component">
      <DirectoryNavigation />
      <SortBy />
      <h1>{state.currentDirectory || '/'}</h1>
    </nav>
  );
}

export default Navbar;
