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
  removeFromTree: "removeFromTree",
  addToTreeIndex: "addToTreeIndex",
  subtractFromTreeIndex: "subtractFromTreeIndex",
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
        arrayIndex: state.arrayIndex + 1,
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
    case actions.removeFromTree:
      return {
        ...state,
      };
    case actions.addToTreeIndex:
      return {
        ...state,
        treeIndex: state.treeIndex + 1,
      };
    case actions.subtractFromTreeIndex:
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
    navigatedDirectories: ["./rootDir"],
    arrayIndex: 0,
    directoryTree: [{ 0: ["./rootDir"] }],
    treeIndex: 0,
  });

  function setDirectory(action, value) {
    if (action === "enterFolder") {
      dispatch({ type: "setCurrentDirectory", value: value });
      if (state.arrayIndex + 1 < state.navigatedDirectories.length) {
        dispatch({ type: "removeFromNavigate" });
      } else {
        dispatch({ type: "addToNavigateIndex" });
      }
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
      dispatch({ type: "setCurrentDirectory", value: value });
      dispatch({ type: "setNavigateDirectory", value: value });
      dispatch({ type: "addToNavigateIndex" });
    }
  }

  return (
    <DirectoryContext.Provider value={{ state, setDirectory }}>
      <Main />
    </DirectoryContext.Provider>
  );
}

export default App;
