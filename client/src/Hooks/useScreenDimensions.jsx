import { useState, useEffect } from "react";

export default function useScreenDimensions() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function getSize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    getSize()
  }, [])
  
  return screenSize;
}