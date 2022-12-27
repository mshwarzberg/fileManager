import { useContext } from "react";
import ButtonNavigation from "./ButtonNavigation";
import { GeneralContext } from "../Main/Main.jsx";
import TrashButtons from "./TrashButtons";
import CurrentDirectory from "./CurrentDirectory";

export default function Navbar({ setPopup, drag }) {
  const {
    directoryState: { currentDirectory },
    setSettings,
    settings: { showDirectoryTree },
    views: { appTheme },
    directoryContent,
    setDirectoryContent,
  } = useContext(GeneralContext);

  return (
    <div id="navbar" className={`navbar-${appTheme}`}>
      <button
        className={`button-${appTheme}`}
        id="toggle-directory-tree"
        onClick={() => {
          setSettings((prevSettings) => ({
            ...prevSettings,
            showDirectoryTree: !prevSettings.showDirectoryTree,
          }));
        }}
      >
        {showDirectoryTree ? "Hide" : "Show"} Tree
      </button>
      <ButtonNavigation />
      {currentDirectory === "Trash" ? (
        <TrashButtons setPopup={setPopup} />
      ) : (
        <CurrentDirectory drag={drag} setPopup={setPopup} />
      )}
    </div>
  );
}
