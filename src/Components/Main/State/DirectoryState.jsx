import { useReducer, useEffect } from "react";

function reducer(state, action) {
  const { drive, navigatedDirectories, navigatedIndex, currentDirectory } =
    state;
  switch (action.type) {
    case "open": {
      if (action.value === currentDirectory) {
        return state;
      }
      let newNavigatedDirectories = navigatedDirectories;
      if (navigatedIndex + 1 < navigatedDirectories.length) {
        newNavigatedDirectories = navigatedDirectories.slice(
          0,
          navigatedIndex + 1
        );
      }
      newNavigatedDirectories = [...newNavigatedDirectories, action.value];
      return {
        ...state,
        currentDirectory: action.value,
        navigatedIndex: navigatedIndex + 1,
        navigatedDirectories: newNavigatedDirectories,
        drive: action.value.slice(0, 3),
      };
    }
    case "up":
      return {
        ...state,
        currentDirectory: action.value,
        navigatedDirectories: [...navigatedDirectories, action.value],
        navigatedIndex: navigatedIndex + 1,
        drive: action.value.slice(0, 3),
      };
    case "back":
      const navBackwards = navigatedDirectories[navigatedIndex - 1];
      if (action.value) {
        navigatedDirectories.pop();
      }
      return {
        ...state,
        currentDirectory: navBackwards,
        navigatedIndex: navigatedIndex - 1,
        drive: navBackwards.slice(0, 3),
      };
    case "forwards":
      const navForwards = navigatedDirectories[navigatedIndex + 1];
      return {
        ...state,
        currentDirectory: navForwards,
        navigatedIndex: navigatedIndex + 1,
        drive: navForwards.slice(0, 3),
      };
    case "updateDirectoryTree":
      return {
        ...state,
        directoryTree: action.value,
      };
    case "resetToDefault":
      return {
        drive: "",
        currentDirectory: "",
        directoryTree: [""],
        navigatedDirectories: [""],
        navigatedIndex: 0,
        networkDrives: [],
      };
    default:
      return state;
  }
}

export default function DirectoryState() {
  const initState = JSON.parse(localStorage.getItem("state") || "{}");

  const [state, dispatch] = useReducer(reducer, {
    drive: initState.drive || "",
    currentDirectory: initState.currentDirectory || "",
    directoryTree: initState.directoryTree || [""],
    navigatedDirectories: initState.navigatedDirectories || [""],
    navigatedIndex: initState.navigatedIndex || 0,
    networkDrives: initState.networkDrives || [],
  });

  useEffect(() => {
    localStorage.setItem(
      "state",
      JSON.stringify({
        drive: state.drive,
        currentDirectory: state.currentDirectory,
        directoryTree: state.directoryTree,
        navigatedDirectories: state.navigatedDirectories,
        navigatedIndex: state.navigatedIndex,
        networkDrives: state.networkDrives,
      })
    );
  }, [state, dispatch]);

  return { state, dispatch };
}
