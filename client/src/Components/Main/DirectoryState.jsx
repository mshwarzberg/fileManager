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
      const navBackwards = state.navigatedDirectories[state.navigatedIndex - 1];

      return {
        ...state,
        currentDirectory: navBackwards,
        navigatedIndex: state.navigatedIndex - 1,
        ...(!navBackwards.startsWith(state.drive) && {
          drive: navBackwards.slice(0, 3),
        }),
      };
    case "forwardDirectory":
      const navForwards = state.navigatedDirectories[state.navigatedIndex + 1];
      let drive;
      if (!navForwards.startsWith(state.drive)) {
        drive = navForwards.slice(0, 3);
      }
      return {
        ...state,
        currentDirectory: navForwards,
        navigatedIndex: state.navigatedIndex + 1,
        drive: drive || state.drive,
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
    case "refresh":
      return {
        ...state,
        refresh: !state.refresh,
      };
    default:
      return state;
  }
}

export default function DirectoryState() {
  const initState = JSON.parse(localStorage.getItem("state"));
  const initTree = JSON.parse(sessionStorage.getItem("tree"));

  const [state, dispatch] = useReducer(reducer, {
    drive: initState?.drive || "",
    currentDirectory: initState?.currentDirectory || "",
    directoryTree: initTree?.directoryTree || [""],
    navigatedDirectories: initState?.navigatedDirectories || [""],
    navigatedIndex: initState?.navigatedIndex || 0,
    refresh: false,
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
        refresh: false,
      })
    );
    sessionStorage.setItem(
      "tree",
      JSON.stringify({ directoryTree: state.directoryTree })
    );
  }, [state, dispatch]);

  return { state, dispatch };
}
