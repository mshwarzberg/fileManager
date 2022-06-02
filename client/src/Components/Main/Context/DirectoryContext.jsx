import { useReducer } from "react";

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
      };
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
    default:
      return state;
  }
}

export default function useDirectoryContextManager() {

  const [state, dispatch] = useReducer(reducer, {
    currentDirectory: "",
    directoryTree: [""],
    navigatedDirectories: [""],
    navigatedIndex: 0,
  });
  
  return {state, dispatch}
}
