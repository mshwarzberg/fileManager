import React, { useContext, useEffect, useState } from "react";
import FormatDate from "../../../Helpers/FormatDate";
import DirectoryNavigation from "../../Tools/DirectoryNavigation";
import SortBy from "../../Tools/Sorting/SortBy";
import { DirectoryContext } from "../App";

function Navbar() {
  const { state, directoryItems } = useContext(DirectoryContext);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let temp;
    temp = setTimeout(() => {
      setTime(new Date());
    }, 0);
    return () => {
      clearTimeout(temp);
    };
  }, [time]);

  return (
    <nav id="navbar--component">
      <h1 id="current-time">{FormatDate(time, true)}</h1>
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
