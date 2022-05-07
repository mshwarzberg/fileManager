import React, { useReducer, createContext } from "react";
import Main from "./Components/Main";

const actions = {
  setCurrentDirectory: "setCurrentDirectory",
  setNavigate: "setNavigate",
  setDirectoryTree: "setDirectoryTree",
  setTreeIndex: "setTreeIndex",
  removeFromTree: "removeFromTree",
};

export const DirectoryContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case actions.setCurrentDirectory:
      return { ...state, currentDirectory: action.value };
    case actions.setNavigate:
      return {
        ...state,
        navigatedDirectories: {
          array: action.value.array,
          index: action.value.index,
        },
      };
    case actions.setDirectoryTree:
      return {
        ...state,
        directoryTree: [
          ...state.directoryTree,
          { [state.treeIndex]: action.value },
        ],
      };
    case actions.removeFromTree:
      return {
        ...state,
        directoryTree: state.directoryTree.slice(
          0,
          state.directoryTree.length - 1
        ),
      };
    case actions.addTreeIndex:
      return {
        ...state,
        treeIndex: state.treeIndex + 1,
      };
    case actions.subtractTreeIndex:
      return {
        ...state,
        treeIndex: state.treeIndex - 1,
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    currentDirectory: "./rootDir",
    navigatedDirectories: {
      array: ["./rootDir"],
      index: 0,
    },
    treeIndex: 0,
    directoryTree: [{ 0: ["./rootDir"] }],
  });

  function setAction(action, value) {
    console.log("oh hell no");
  }

  function setDirTree(folders) {
    dispatch({ type: actions.setDirectoryTree, value: folders });
  }

  function setDirectory(callLocation, callArguments) {
    const newDirectory = (directory) => {
      if (directory) {
        callArguments[0] = directory;
      }
      return dispatch({ type: "setCurrentDirectory", value: callArguments[0] });
    };

    const navigateTo = (toFolder) => {
      return dispatch({
        type: "setNavigate",
        value: {
          array: [
            ...state.navigatedDirectories.array.slice(
              0,
              state.navigatedDirectories.index
            ),
            toFolder,
          ],
          index: state.navigatedDirectories.index + 1,
        },
      });
    };

    const navigateBackwards = () => {
      return dispatch({
        type: "setNavigate",
        value: {
          array: state.navigatedDirectories.array,
          index: state.navigatedDirectories.index - 1,
        },
      });
    };

    const navigateForwards = () => {
      return dispatch({
        type: "setNavigate",
        value: {
          array: state.navigatedDirectories.array,
          index: state.navigatedDirectories.index + 1,
        },
      });
    };
    if (callLocation === "InputDirectoryChange") {
      if (callArguments === undefined) {
        dispatch({ type: "setCurrentDirectory", value: "./rootDir" });
        return navigateTo("./rootDir");
      }

      newDirectory();
      navigateTo(state.currentDirectory);

      if (callArguments[1].length > callArguments[0].length) {
        return dispatch({ type: "removeFromTree", value: state.treeIndex });
      }
      return;
    } else if (callLocation === "RenderFiles") {
      newDirectory();
      return navigateTo(callArguments[0]);
    } else if (callLocation === "DirectoryNavigation") {
      if (callArguments[0] === "UpFolder") {
        newDirectory(callArguments[1]);
        return navigateTo(callArguments[0]);
      } else if (callArguments[0] === "BackFolder") {
        newDirectory(callArguments[1]);
        return navigateBackwards();
      } else if (callArguments[0] === "ForwardFolder") {
        newDirectory(callArguments[1]);
        return navigateForwards();
      }
    }
  }

  return (
    <DirectoryContext.Provider
      value={{ state, setAction, setDirTree, setDirectory }}
    >
      <Main />
    </DirectoryContext.Provider>
  );
}

export default App;
