import { useContext } from "react";
import ButtonNavigation from "./ButtonNavigation";
import { GeneralContext } from "../Main/Main.jsx";
import TrashButtons from "./TrashButtons";
import CurrentDirectory from "./CurrentDirectory";

export default function Navbar({ setPopup, drag }) {
  const {
    state: { currentDirectory },
    setSettings,
    settings: { showDirectoryTree },
    views: { appTheme },
    directoryItems,
    setDirectoryItems,
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
        <TrashButtons
          setPopup={setPopup}
          directoryItems={directoryItems}
          setDirectoryItems={setDirectoryItems}
        />
      ) : (
        <CurrentDirectory drag={drag} setPopup={setPopup} />
      )}
    </div>
  );
}
