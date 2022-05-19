import React from "react";
import DirectoryNavigation from "./DirectoryManagement/DirectoryNavigation";
import SortBy from "./Sorting/SortBy";

import Reload from "../../Assets/images/reload.png";
import ReloadHover from "../../Assets/images/reloadhover.png";

function Navbar(props) {
  const { setDirectoryItems, setReload, reload, directoryItems } = props;

  return (
    <nav id="navbar--component">
      <DirectoryNavigation />
      <SortBy setDirectoryItems={setDirectoryItems} />
      <button
        className="navbar--button"
        id="reload--icon"
        disabled={directoryItems?.length === 0}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.firstChild.src = ReloadHover;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.src = Reload;
        }}
      >
      <img
        alt="reload"
        title="Reload current page"
        style={{width: '100%'}}
        src={Reload}
        onClick={() => {
          setReload(!reload);
        }}
      />
      </button>
    </nav>
  );
}

export default Navbar;
