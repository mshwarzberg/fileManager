import React, { useRef } from 'react'
import menu from '../../../Assets/images/menu.png'

let hideTimeout
export default function FileManagePopup(props) {
  const popup = useRef()

  function showHidePopup(value) {
    clearTimeout(hideTimeout)
    if (popup.current) {
      popup.current.style.display = value
    }
  }
  return (
    <div id='file--manage-body'>
      <img src={menu} alt="" onMouseEnter={() => {
        showHidePopup('block')
      }} onMouseLeave={() => {
        hideTimeout = setTimeout(() => {
          showHidePopup('none')
        }, 300);
      }}/>
      <div ref={popup} onMouseEnter={() => {
        showHidePopup('block')
      }} onMouseLeave={() => {
        hideTimeout = setTimeout(() => {
          showHidePopup('none')
        }, 300);
      }}>
        
      </div>
    </div>
  )
}
