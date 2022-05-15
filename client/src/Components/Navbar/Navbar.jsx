import React from "react";
import DirectoryNavigation from "./DirectoryManagement/DirectoryNavigation";
import SortBy from "./Sorting/SortBy";
import Reload from "../../Assets/images/reload.png";
import ReloadHover from "../../Assets/images/reloadhover.png";

function Navbar(props) {
  const { setDirectoryItems, setReload, reload } = props;

  return (
    <nav id="navbar--component">
      <DirectoryNavigation />
      <SortBy setDirectoryItems={setDirectoryItems} />
      <img
        alt="reload"
        className="navbar--button"
        id="reload--icon"
        title="Reload current page"
        onMouseEnter={(e) => {
          e.currentTarget.src = ReloadHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.src = Reload;
        }}
        src={Reload}
        onClick={() => {
          setReload(!reload);
        }}
      />
      
    </nav>
  );
}

export default Navbar;
