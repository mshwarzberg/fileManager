import React, { useContext } from "react";
import { DirectoryStateContext } from "../../../../App";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
import useFetch from "../../../../Hooks/useFetch";

export default function ChildDir(props) {

  const {addToPath, subItem, margin} = props
  const {state, dispatch} = useContext(DirectoryStateContext)

  const {data: directories} = useFetch('/api/getdirectories', JSON.stringify({path: `./root/${addToPath}/${subItem}`}))

  const changeItem = useUpdateDirectoryTree()

  return (
    <p
      onClick={() => {
        let parentDirs = [];
        if (addToPath) {
          parentDirs = addToPath.split("/");
        }

        parentDirs.push(subItem);
        dispatch({
          type: "openDirectory",
          value: `./root/${addToPath}/${subItem}`,
        });
        if (directories) {
          dispatch({
            type: 'updateDirectoryTree', 
            value: changeItem(state.directoryTree, parentDirs, 0, directories.array)
          })
        }
      }}
      style={{ marginLeft: `${margin * 7}px` }}
      className="directorytree--directory"
      title={`Name: ${subItem}\nPath: ${`./root/${addToPath}/${subItem}`}`}
    >
      {subItem}
    </p>
  );
}
