import { useContext } from "react";
import ButtonNavigation from "./ButtonNavigation";
import { GeneralContext } from "../Main/App.jsx";
import TrashButtons from "./TrashButtons";
import CurrentDirectory from "./CurrentDirectory";

export default function Navbar({ setPopup }) {
  const {
    state: { currentDirectory },
    setSettings,
    settings,
    settings: { appTheme },
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
        {settings.showDirectoryTree ? "Hide" : "Show"} Tree
      </button>
      <ButtonNavigation />
      {currentDirectory === "Trash" ? (
        <TrashButtons
          setPopup={setPopup}
          directoryItems={directoryItems}
          setDirectoryItems={setDirectoryItems}
        />
      ) : (
        <CurrentDirectory />
      )}
    </div>
  );
}
