import React, { useContext } from "react";
import { DirectoryContext } from "../Main/App";

import forwards from "../../Assets/images/navigation/forwardshover.png";
import backwards from "../../Assets/images/navigation/backwardshover.png";
import upwards from "../../Assets/images/navigation/upwardshover.png";

function DirectoryNavigation() {
  const { state, dispatch, controllers } = useContext(DirectoryContext);

  return (
    <div id="navbar--navigation">
      <button
        onClick={() => {
          for (let i in controllers) {
            controllers[i].abort();
          }
          let uppedDirectory = state.currentDirectory;
          if (
            uppedDirectory.length === 3 &&
            uppedDirectory[1] === ":" &&
            uppedDirectory[2] === "/"
          ) {
            uppedDirectory = "";
          } else {
            for (let i = uppedDirectory.length - 1; i >= 0; i--) {
              if (uppedDirectory[i] === "/") {
                if (uppedDirectory[i - 1] === ":") {
                  uppedDirectory = uppedDirectory.slice(0, i + 1);
                  break;
                }
                uppedDirectory = uppedDirectory.slice(0, i);
                break;
              }
            }
          }
          dispatch({ type: "upDirectory", value: uppedDirectory });
        }}
        data-title="Go Up"
        data-style={JSON.stringify({
          background: "pink",
          border: "2px solid black",
          fontFamily: "bebas neue",
          color: "black",
          paddingLeft: "1rem",
          fontSize: "1rem",
        })}
        className="navbar--button"
        disabled={state.currentDirectory === ""}
      >
        <img src={upwards} alt="up" />
      </button>
      <button
        data-title="Go Back"
        data-style={JSON.stringify({
          background: "pink",
          border: "2px solid black",
          fontFamily: "bebas neue",
          color: "black",
          paddingLeft: "1rem",
          fontSize: "1rem",
        })}
        id="navbar--backwards"
        className="navbar--button"
        onClick={() => {
          for (let i in controllers) {
            controllers[i].abort();
          }
          dispatch({ type: "backDirectory" });
        }}
        disabled={state.navigatedIndex === 0}
      >
        <img src={backwards} alt="up" />
      </button>
      <button
        data-title="Go Forwards"
        data-style={JSON.stringify({
          background: "pink",
          border: "2px solid black",
          fontFamily: "bebas neue",
          color: "black",
          paddingLeft: "1rem",
          fontSize: "1rem",
        })}
        onClick={() => {
          for (let i in controllers) {
            controllers[i].abort();
          }
          dispatch({ type: "forwardDirectory" });
        }}
        id="navbar--forwards"
        className="navbar--button"
        disabled={
          state.navigatedIndex === state.navigatedDirectories.length - 1
        }
      >
        <img src={forwards} alt="up" />
      </button>
    </div>
  );
}

export default DirectoryNavigation;
