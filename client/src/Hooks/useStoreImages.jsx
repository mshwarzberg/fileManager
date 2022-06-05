import { useEffect } from 'react'
import folder from '../Assets/images/folder.png'
import symlink from '../Assets/images/symlink.png'
import close from '../Assets/images/close.png'
import alert from '../Assets/images/alert.png'

export function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = () => {
    var reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
export default function useStoreImages() {
  
  useEffect(() => {
    if (!localStorage.getItem('folder')) {
      localStorage.setItem('folder', folder)
    }
    if (!localStorage.getItem('symlink')) {
      toDataURL(symlink, function(dataUrl) {
      localStorage.setItem('symlink', dataUrl)
    })
    }
    if (!localStorage.getItem('close')) {
      toDataURL(close, function(dataUrl) {
        localStorage.setItem('close', dataUrl)
      })
    }
    if (!localStorage.getItem('alert')) {
      toDataURL(alert, function(dataUrl) {
        localStorage.setItem('alert', dataUrl)
      })
    }
  })
}
