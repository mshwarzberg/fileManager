import React, { createContext, useState } from 'react'
import Main from './Components/Main';

export const DirectoryContext = createContext()

function App() {
  
  const [currentDir, setCurrentDir] = useState('./rootDir')
  
  return (
    <DirectoryContext.Provider value={{currentDir, setCurrentDir}}>
      <Main />
    </DirectoryContext.Provider>
  );
}

export default App;
