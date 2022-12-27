import { useContext } from "react";
import { GeneralContext } from "../Main/Main.jsx";

export default function ButtonNavigation() {
  const {
    directoryState,
    dispatch,
    views: { appTheme },
  } = useContext(GeneralContext);

  return (
    <div id="navbar-navigation">
      <button
        className={`button-${appTheme}`}
        onClick={() => {
          let uppedDirectory = "";
          for (
            let i = directoryState.currentDirectory.length - 2;
            i >= 0;
            i--
          ) {
            if (directoryState.currentDirectory[i] === "/") {
              uppedDirectory = directoryState.currentDirectory.slice(0, i + 1);
              break;
            }
          }

          dispatch({ type: "up", value: uppedDirectory });
        }}
        disabled={directoryState.currentDirectory === ""}
      >
        Up
      </button>
      <button
        className={`button-${appTheme}`}
        id="navigate-back"
        onClick={() => {
          dispatch({ type: "back" });
        }}
        disabled={directoryState.navigatedIndex === 0}
      >
        Back
      </button>
      <button
        className={`button-${appTheme}`}
        id="navigate-forwards"
        onClick={() => {
          dispatch({ type: "forwards" });
        }}
        disabled={
          directoryState.navigatedIndex ===
          directoryState.navigatedDirectories.length - 1
        }
      >
        Forwards
      </button>
    </div>
  );
}
