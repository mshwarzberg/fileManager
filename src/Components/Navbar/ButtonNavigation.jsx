import { useContext } from "react";
import { GeneralContext } from "../Main/Main.jsx";

export default function ButtonNavigation() {
  const {
    state,
    dispatch,
    views: { appTheme },
  } = useContext(GeneralContext);

  return (
    <div id="navbar-navigation">
      <button
        className={`button-${appTheme}`}
        onClick={() => {
          let uppedDirectory = "";
          for (let i = state.currentDirectory.length - 2; i >= 0; i--) {
            if (state.currentDirectory[i] === "/") {
              uppedDirectory = state.currentDirectory.slice(0, i + 1);
              break;
            }
          }

          dispatch({ type: "up", value: uppedDirectory });
        }}
        disabled={state.currentDirectory === ""}
      >
        Up
      </button>
      <button
        className={`button-${appTheme}`}
        id="navigate-back"
        onClick={() => {
          dispatch({ type: "back" });
        }}
        disabled={state.navigatedIndex === 0}
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
          state.navigatedIndex === state.navigatedDirectories.length - 1
        }
      >
        Forwards
      </button>
    </div>
  );
}
