import React, { useContext, useEffect, useState } from "react";

import DirectoryNavigation from "./ButtonNavigation";
import { GeneralContext } from "../App";
import TextNavigation from "./TextNavigation";
import DateAndTime from "./DateAndTime";

function Navbar({ showTree, setShowTree }) {
  const { directoryItems } = useContext(GeneralContext);

  function navigate(e) {
    if (e.button === 3) {
      document.getElementById("navbar--backwards").click();
    } else if (e.button === 4) {
      document.getElementById("navbar--forwards").click();
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", navigate);
    return () => {
      window.removeEventListener("mousedown", navigate);
    };
  }, []);

  return (
    <nav id="navbar--component">
      <button
        className="navbar--button"
        id="directorytree--button-showhide"
        onClick={() => {
          setShowTree(!showTree);
          localStorage.setItem(
            "isTreeVisible",
            JSON.stringify({ value: !showTree })
          );
        }}
      >
        {showTree ? "Hide Tree" : "Show Tree"}
      </button>
      <DateAndTime />
      <DirectoryNavigation />
      <div id="navbar--dir-info">
        <TextNavigation />
        <h1>{directoryItems.length || 0} items loaded</h1>
      </div>
    </nav>
  );
}

export default Navbar;
