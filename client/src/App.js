import React, { createContext, useState } from 'react'
import Explorer from './Components/Explorer';

export const DirectoryContext = createContext()

function App() {
  const [currentDir, setCurrentDir] = useState('./rootDir')

  return (
    <DirectoryContext.Provider value={{currentDir, setCurrentDir}}>
      <Explorer />
    </DirectoryContext.Provider>
  );
}

export default App;
