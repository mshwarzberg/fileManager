import React, { useReducer, createContext } from "react";
import LoadDirectoryData from "./Components/LoadData/LoadDirectoryData";
import DirectoryTree from "./Components/DirectoryManagement/DirectoryTree/DirectoryTree";

export const DirectoryStateContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "openDirectory": {
      let newNavigatedDirectories = [...state.navigatedDirectories]
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
        navigatedIndex: state.navigatedIndex + 1
      }
    case "backDirectory":
      return {
        ...state,
        currentDirectory: state.navigatedDirectories[state.navigatedIndex - 1],
        navigatedIndex: state.navigatedIndex - 1,
      };
    case "forwardDirectory":
      return {
        ...state,
        currentDirectory: state.navigatedDirectories[state.navigatedIndex + 1],
        navigatedIndex: state.navigatedIndex + 1,
      };
    case "directoryNotFoundError":
      return {
        ...state,
        currentDirectory:
          state.navigatedDirectories[state.navigatedIndex - 1] || "./root",
        navigatedIndex: state.navigatedIndex - 1,
        navigatedDirectories: state.navigatedDirectories.slice(
          0,
          state.navigatedIndex + 1
        ),
      };
    case "updateDirectoryTree":
      return {
        ...state, 
        directoryTree: action.value
      }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    currentDirectory: "./root",
    directoryTree: [],
    navigatedDirectories: ["./root"],
    navigatedIndex: 0,
  });


  return (
    <>
      <DirectoryStateContext.Provider value={{ state, dispatch }}>
        <LoadDirectoryData />
        <DirectoryTree />
      </DirectoryStateContext.Provider>
    </>
  );
}
