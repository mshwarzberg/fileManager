import React, {useContext} from 'react'
import DownArrow from "../../../../Assets/images/down-arrow.png";
import RightArrow from "../../../../Assets/images/right-arrow.png";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
import { DirectoryStateContext } from "../../../../App";
export default function ParentDir(props) {
  
  const {openDirName, margin, openDirectory, path} = props
  const changeItem = useUpdateDirectoryTree()
  const {state, dispatch} = useContext(DirectoryStateContext)


  return (
    <div
        style={{
          marginLeft: `${margin * 7}px`,
        }}
        className="directorytree--expanded-directory"
      >
        <div className="line--down" />
        <p className="directorytree--parent-directory" title={openDirName}>
          <img
            onClick={(e) => {
              
              let parentDirs = `root/${path}/${openDirName}`
              parentDirs = parentDirs.split('/')
              console.log(changeItem(state.directoryTree, parentDirs, 0, openDirName))
              // console.log(changeItem(state.directoryTree, ,0))
              if (e.target.parentElement.nextSibling.style.display === "") {
                e.target.parentElement.nextSibling.style.display = "none";
                e.target.src = RightArrow;
              } else {
                e.target.parentElement.nextSibling.style.display = "";
                e.target.src = DownArrow;
              }
            }}
            className="directorytree-parent-down"
            src={DownArrow}
            alt=""
          />
          {openDirName}
        </p>
        <div className="directorytree--open-directories">{openDirectory}</div>
      </div>
  )
}
