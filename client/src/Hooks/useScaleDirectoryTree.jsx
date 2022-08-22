import { useEffect, useState } from "react";

export default function useScaleDirectoryTree(showTree, setBackgroundFade) {
  const [scalingTree, setScalingTree] = useState(false);

  useEffect(() => {
    const lineSplit = document.getElementById("split-main-page");
    function handleMouseDown(e) {
      if (e.button === 0) {
        setScalingTree(true);
      }
    }
    function handleMouseMove(e) {
      if (scalingTree) {
        const directoryTree = document.getElementById("directorytree--body");
        directoryTree.style.flex = `0 0 ${e.clientX}px`;
        setBackgroundFade(`linear-gradient(
          90deg,
          #050505 0%,
          #050505 ${(e.clientX / window.innerWidth) * 100}%,
          #333 ${(e.clientX / window.innerWidth) * 100 + 10}%,
          #333 100%
        )`);
      }
    }
    function handleMouseUp(e) {
      if (scalingTree) {
        setScalingTree();
        localStorage.setItem("directoryTreeWidth", e.clientX);
      }
    }
    lineSplit?.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      lineSplit?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scalingTree, showTree]);
}
