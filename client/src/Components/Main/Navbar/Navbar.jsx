import React, { useContext, useEffect, useState } from "react";
import FormatDate from "../../../Helpers/FormatDate";
import DirectoryNavigation from "./DirectoryNavigation";
import { GeneralContext } from "../App";

function Navbar({ showTree, setShowTree }) {
  const { state, directoryItems } = useContext(GeneralContext);

  const [time, setTime] = useState(new Date());

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
      <h1 id="current-time">{FormatDate(time, true)}</h1>
      <DirectoryNavigation />
      <div id="navbar--dir-info">
        <h1 data-title={state.currentDirectory}>
          {state.currentDirectory || "Computer:"}
        </h1>
        <h1>{directoryItems?.length || 0} items loaded</h1>
      </div>
    </nav>
  );
}

export default Navbar;
