import { useReducer, useEffect } from "react";

function reducer(directoryState, action) {
  const { drive, navigatedDirectories, navigatedIndex, currentDirectory } =
    directoryState;
  switch (action.type) {
    case "open": {
      if (action.value === currentDirectory) {
        return directoryState;
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
        ...directoryState,
        currentDirectory: action.value,
        navigatedIndex: navigatedIndex + 1,
        navigatedDirectories: newNavigatedDirectories,
        drive: action.value.slice(0, 3),
      };
    }
    case "up":
      return {
        ...directoryState,
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
        ...directoryState,
        currentDirectory: navBackwards,
        navigatedIndex: navigatedIndex - 1,
        drive: navBackwards.slice(0, 3),
      };
    case "forwards":
      const navForwards = navigatedDirectories[navigatedIndex + 1];
      return {
        ...directoryState,
        currentDirectory: navForwards,
        navigatedIndex: navigatedIndex + 1,
        drive: navForwards.slice(0, 3),
      };
    case "updateDirectoryTree":
      return {
        ...directoryState,
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
    case "setName":
      return {
        ...directoryState,
        currentDirectoryName: action.value,
      };
    default:
      return directoryState;
  }
}

export default function DirectoryState() {
  const initState = JSON.parse(localStorage.getItem("directoryState") || "{}");

  const [directoryState, dispatch] = useReducer(reducer, {
    drive: initState.drive || "",
    currentDirectory: initState.currentDirectory || "",
    currentDirectoryName: initState.currentDirectoryName || "",
    directoryTree: initState.directoryTree || [""],
    navigatedDirectories: initState.navigatedDirectories || [""],
    navigatedIndex: initState.navigatedIndex || 0,
    networkDrives: initState.networkDrives || [],
  });

  useEffect(() => {
    localStorage.setItem(
      "directoryState",
      JSON.stringify({
        drive: directoryState.drive,
        currentDirectory: directoryState.currentDirectory,
        currentDirectoryName: directoryState.currentDirectoryName,
        directoryTree: directoryState.directoryTree,
        navigatedDirectories: directoryState.navigatedDirectories,
        navigatedIndex: directoryState.navigatedIndex,
        networkDrives: directoryState.networkDrives,
      })
    );
  }, [directoryState, dispatch]);

  return { directoryState, dispatch };
}
