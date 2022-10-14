import { useContext } from "react";
import ButtonNavigation from "./ButtonNavigation";
import { DirectoryContext } from "../Main/App";
import TrashButtons from "./TrashButtons";
import CurrentDirectory from "./CurrentDirectory";

export default function Navbar({ setPopup }) {
  const {
    state: { currentDirectory },
    setSettings,
    settings,
    directoryItems,
    setDirectoryItems,
  } = useContext(DirectoryContext);

  return (
    <div id="navbar">
      <button
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
