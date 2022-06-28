import { useReducer, useEffect, useState } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "openDirectory": {
      let newNavigatedDirectories = [...state.navigatedDirectories];
      if (state.navigatedIndex + 1 < state.navigatedDirectories.length) {
        newNavigatedDirectories = state.navigatedDirectories.slice(
          0,
          state.navigatedIndex + 1
        );
      }
      newNavigatedDirectories = [...newNavigatedDirectories, action.value];
      return {
        ...state,
        currentDirectory: action.value,
        navigatedIndex: state.navigatedIndex + 1,
        navigatedDirectories: newNavigatedDirectories,
      };
    }
    case "upDirectory":
      return {
        ...state,
        currentDirectory: action.value,
        navigatedDirectories: [...state.navigatedDirectories, action.value],
        navigatedIndex: state.navigatedIndex + 1,
        ...(action.value === "" && { drive: "" }),
      };
    case "backDirectory":
      const lastNavigated =
        state.navigatedDirectories[state.navigatedIndex - 1];
      const nextNavigated =
        state.navigatedDirectories[state.navigatedIndex - 2];

      let drive;
      for (let i in nextNavigated) {
        if (nextNavigated[i] === "/") {
          drive = nextNavigated.slice(0, i + 1);
          break;
        }
      }
      return {
        ...state,
        currentDirectory: lastNavigated,
        navigatedIndex: state.navigatedIndex - 1,
        ...(!lastNavigated.startsWith(state.drive) &&
          lastNavigated && {
            drive: "",
          }),
        ...(lastNavigated === "" && { drive: drive || "" }),
      };
    case "forwardDirectory":
      return {
        ...state,
        currentDirectory: state.navigatedDirectories[state.navigatedIndex + 1],
        navigatedIndex: state.navigatedIndex + 1,
        ...(!state.currentDirectory && {
          drive: state.navigatedDirectories[state.navigatedIndex + 1],
        }),
      };
    case "directoryNotFoundError":
      return {
        ...state,
        currentDirectory:
          state.navigatedDirectories[state.navigatedIndex - 1] || "",
        navigatedIndex: state.navigatedIndex - 1,
        navigatedDirectories: state.navigatedDirectories.slice(
          0,
          state.navigatedIndex
        ),
      };
    case "updateDirectoryTree":
      return {
        ...state,
        directoryTree: action.value,
      };
    case "setDriveName":
      return {
        ...state,
        drive: action.value,
      };
    default:
      return state;
  }
}

export default function useDirectoryContextManager() {
  const initState = JSON.parse(localStorage.getItem("state"));

  const [state, dispatch] = useReducer(reducer, {
    drive: initState?.drive || "",
    currentDirectory: initState?.currentDirectory || "",
    directoryTree: initState?.directoryTree || [""],
    navigatedDirectories: initState?.navigatedDirectories || [""],
    navigatedIndex: initState?.navigatedIndex || 0,
  });

  const [controllers, setControllers] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      "state",
      JSON.stringify({
        drive: state.drive,
        currentDirectory: state.currentDirectory,
        directoryTree: state.directoryTree,
        navigatedDirectories: state.navigatedDirectories,
        navigatedIndex: state.navigatedIndex,
      })
    );
  }, [state, dispatch]);

  return { state, dispatch, controllers, setControllers };
}
