import React, { createContext, useEffect, useState } from "react";
import Main from "./Components/Main";

export const DirectoryContext = createContext();

function App() {

  const [currentDir, setCurrentDir] = useState("./rootDir");
  const [navigatedDirs, setNavigatedDirs] = useState({
    array: ["./rootDir"],
    index: 0
  });
  // useEffect(() => {
  //   console.log(navigatedDirs.array, navigatedDirs.index, navigatedDirs.array[navigatedDirs.index]);
  // }, [navigatedDirs])
  return (
    <DirectoryContext.Provider
      value={{
        currentDir,
        setCurrentDir,
        navigatedDirs,
        setNavigatedDirs,
      }}
    >
      <Main />
    </DirectoryContext.Provider>
  );
}

export default App;
