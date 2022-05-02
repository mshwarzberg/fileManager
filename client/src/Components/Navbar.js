import React from 'react'
import folderIconForNavbar from '../images/navfolder.png'

function Navbar(props) {

  const { currentDir, setCurrentDir, setCurrentItem } = props

  return (
    <nav id='navbar--navbar'>
      <button id='navbar--back' onClick={() => {
        setCurrentDir(prevDir => {
          for (let i = prevDir.length - 2; i > 0; i--) {
            if (prevDir[i] === '/') {
              return prevDir.slice(0, i+1)
            }
          }
          return prevDir
        })
        setCurrentItem(0)
      }} disabled={currentDir === './rootDir/'}>Back</button>
      <img src={folderIconForNavbar} alt="folder" /><h1 id='navbar--current-directory'>&nbsp;{currentDir}</h1>
    </nav>
  )
}

export default Navbar