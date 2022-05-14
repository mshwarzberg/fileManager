import React, { useContext } from "react";
import { DirectoryStateContext } from "../../../../App";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
import useFetch from "../../../../Hooks/useFetch";

export default function ChildDir(props) {

  const {addToStr, subItem, margin} = props
  const {state, dispatch} = useContext(DirectoryStateContext)

  const {data: directories} = useFetch('/api/getdirectories', JSON.stringify({path: `./root/${addToStr}/${subItem}`}))

  const changeItem = useUpdateDirectoryTree()

  return (
    <p
      onClick={() => {
        let parentDirs = [];
        if (addToStr) {
          parentDirs = addToStr.split("/");
        }

        parentDirs.push(subItem);
        dispatch({
          type: "openDirectory",
          value: `./root/${addToStr}/${subItem}`,
        });
        console.log(`./root/${addToStr}/${subItem}`)
        if (directories) {
          dispatch({
            type: 'updateDirectoryTree', 
            value: changeItem(state.directoryTree, parentDirs, 0, directories.array)
          })
        }
      }}
      style={{ marginLeft: `${margin * 7}px` }}
      className="directorytree--directory"
    >
      {subItem}
    </p>
  );
}
