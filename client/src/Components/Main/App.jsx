import React, { createContext, useEffect, useState } from "react";
import DirectoryState from "./DirectoryState";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import GeneralUI from "../Tools/GeneralUI";

export const GeneralContext = createContext();

export default function App() {
  const { state, dispatch } = DirectoryState();

  const [controllers, setControllers] = useState([]);
  const [directoryItems, setDirectoryItems] = useState();
  const [showTree, setShowTree] = useState(true);

  useEffect(() => {
    for (let i of controllers) {
      i.abort();
    }
    setControllers([]);
    if (state.drive && state.currentDirectory) {
      document.title = state.currentDirectory;
      fetch("/api/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentdirectory: state.currentDirectory,
          drive: state.drive,
        }),
      })
        .then(async (res) => {
          const response = await res.json();
          setDirectoryItems(response);
        })
        .catch((err) => {
          setDirectoryItems([
            {
              err: err.toString(),
            },
          ]);
        });
    } else {
      fetch("/api/getdrives").then(async (res) => {
        const response = await res.json();
        setDirectoryItems(response);
        dispatch({
          type: "updateDirectoryTree",
          value: [
            "",
            ...response.map((item) => {
              return item.name.slice(0, item.name.length - 1);
            }),
          ],
        });
      });
    }
    // eslint-disable-next-line
  }, [state.currentDirectory, state.refresh]);

  return (
    <GeneralContext.Provider
      value={{
        state,
        dispatch,
        directoryItems,
        setDirectoryItems,
      }}
    >
      <Navbar setShowTree={setShowTree} showTree={showTree} />
      <div id="directory-and-item-container">
        <DirectoryTree showTree={showTree} />
        <RenderItems
          controllers={controllers}
          setControllers={setControllers}
        />
      </div>
      <GeneralUI />
    </GeneralContext.Provider>
  );
}
