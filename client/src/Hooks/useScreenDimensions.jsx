import { useState, useEffect } from "react";

export default function useScreenDimensions(dependency) {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });
  
  useEffect(() => {
    window.addEventListener('resize', () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    })
      function getSize() {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      getSize()
    return () => {
      window.removeEventListener('resize', () => {})
    }
  }, [])
  
  return screenSize;
}