import React, { useReducer, createContext } from "react";
import Main from "./Components/Main";
import useLog from "./Hooks/useLog";

const actions = {
  setCurrentDirectory: "setCurrentDirectory",
  setNavigateDirectory: "setNavigateDirectory",
  removeFromNavigate: "removeFromNavigate",
  addToNavigateIndex: "addToNavigateIndex",
  subtractFromNavigateIndex: "subtractFromNavigateIndex",
  setDirectoryTree: "setDirectoryTree",
};

export const DirectoryContext = createContext();

function reducer(state, action) {
  
  switch (action.type) {
    case actions.setCurrentDirectory:
      return { ...state, currentDirectory: action.value };
    case actions.setNavigateDirectory:
      return {
        ...state,
        navigatedDirectories: [...state.navigatedDirectories, action.value],
      };
    case actions.removeFromNavigate:
      return {
        ...state,
        navigatedDirectories: state.navigatedDirectories.slice(
          0,
          state.arrayIndex + 1
        ),
      };
    case actions.addToNavigateIndex:
      return {
        ...state,
        arrayIndex: state.arrayIndex + 1,
      };
    case actions.subtractFromNavigateIndex:
      return {
        ...state,
        arrayIndex: state.arrayIndex - 1,
      };
    case actions.setDirectoryTree:
      return {
        ...state,
        directoryTree: [
          ...state.directoryTree,
          { [state.treeIndex]: action.value },
        ],
      };
    default:
      return state;
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, {
    currentDirectory: "./rootDir",
    navigatedDirectories: ["./rootDir"],
    arrayIndex: 0,
    directoryTree: [],
  });

  function setDirectory(action, value) {

    // if the new input is the same as the current folder don't do anything
    if (state.currentDirectory === value) {
      return
    }
    if (value === "." || value === "./" || value === "") {
      value = "./rootDir";
    }
    if (action === "enterFolder") {
      dispatch({ type: "setCurrentDirectory", value: value });
      if (state.arrayIndex + 1 < state.navigatedDirectories.length) {
        dispatch({ type: "removeFromNavigate" });
      }
      dispatch({ type: "addToNavigateIndex" });
      dispatch({ type: "setNavigateDirectory", value: value });
      return;
    } else if (action === "goBackFolder") {
      dispatch({
        type: "setCurrentDirectory",
        value: state.navigatedDirectories[state.arrayIndex - 1],
      });
      dispatch({ type: "subtractFromNavigateIndex" });
      return;
    } else if (action === "goForwardsFolder") {
      dispatch({
        type: "setCurrentDirectory",
        value: state.navigatedDirectories[state.arrayIndex + 1],
      });
      dispatch({ type: "addToNavigateIndex" });
      return;
    } else if (action === "goUpFolder") {
      dispatch({ type: "setCurrentDirectory", value: value });
      dispatch({ type: "setNavigateDirectory", value: value });
      dispatch({ type: "addToNavigateIndex" });
      return;
    } else if (action === "searchDirectory") {
      // dispatch({ type: "setCurrentDirectory", value: value });
      // dispatch({ type: "setNavigateDirectory", value: value });
      // dispatch({ type: "addToNavigateIndex" });
      // if (value.length < state.currentDirectory.length) {
      //   let loopLength = state.currentDirectory.length - value.length - 1
      //     for (
      //       let i = loopLength;
      //       i > 0;
      //       i--
      //     ) {
      //       if (
      //         state.currentDirectory[i] === "/" ||
      //         state.currentDirectory[i] === "\\"
      //       ) {
      //         dispatch({ type: "removeFromTree" });
      //         dispatch({ type: "subtractFromTreeIndex" });
      //       }
      //     }
      // } else {
      //   dispatch({ type: "setDirectoryTree", value: value });
      //   dispatch({ type: "addToTreeIndex" });
      // }
      // return;
    } else if (action === "handleError") {
      dispatch({
        type: "setCurrentDirectory",
        value: state.navigatedDirectories[state.arrayIndex - 1] || "./rootDir",
      });
      dispatch({
        type: "subtractFromNavigateIndex",
      });
      dispatch({ type: "removeFromNavigate" });
      return;
    }
  }

  return (
    <DirectoryContext.Provider value={{ state, setDirectory }}>
      <Main />
    </DirectoryContext.Provider>
  );
}

export default App;
