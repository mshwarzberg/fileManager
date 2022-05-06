import React, { useState, useContext, useEffect } from "react";
import ReactDOM from 'react-dom/client'
import {DirectoryContext} from '../../../App'

function DirectoryTree(props) {

  const {currentDir, setCurrentDir} = useContext(DirectoryContext)
  const {itemsInDirectory} = props
  const [treeIndex, setTreeIndex] = useState(0)
  const [showTree, setShowTree] = useState(false);
  const [directoryTree, setDirectoryTree] = useState([{[treeIndex]: './rootDir'}])

  useEffect(() => {
      if (itemsInDirectory[0]) {
        setDirectoryTree(prevDirTree => {
          let array = []
          itemsInDirectory.map(item => {
            if (item.itemtype === 'folder' && !directoryTree.treeIndex !== item.name) {
              return array.push(item.name)
            } 
            return ''
          })
          if (array[0]) {
            return [...prevDirTree,{[treeIndex]: array}]
          }
          return [{...prevDirTree}]
        })
        console.log(directoryTree);
      }
  }, [itemsInDirectory])

  const renderDirectoryTree = directoryTree.map(item => {
    if (typeof item === 'string') {
      return console.log('string', item);
    }
    return console.log('array', item);
  })

  return (
    <div id="directory--tree">
      <button
        id="directorytree--button-showhide"
        onClick={() => {
          setShowTree(!showTree);
        }}
      >
        Show Tree
      </button>
      {showTree && (
        <div id="directorytree--body">
          <h1 id="directory--tree-current-directory">{currentDir}</h1>
          {renderDirectoryTree}
        </div>
      )}
    </div>
  );
}

export default DirectoryTree;
