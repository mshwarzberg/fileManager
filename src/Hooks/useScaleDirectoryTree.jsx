import { useEffect, useState, useContext } from "react";
import { DirectoryContext } from "../Components/Main/App";

export default function useScaleDirectoryTree() {
  const [scalingTree, setScalingTree] = useState(false);
  const { settings } = useContext(DirectoryContext);
  useEffect(() => {
    const lineSplit = document.getElementById("directory-tree-scaler");
    function handleMouseDown(e) {
      if (e.button === 0) {
        setScalingTree(true);
      }
    }
    function handleMouseMove(e) {
      if (scalingTree) {
        if (e.clientX < 200 || e.clientX > window.innerWidth / 2) {
          return;
        }
        const directoryTree = document.getElementById("directory-tree");
        directoryTree.style.flex = `0 0 ${e.clientX - 16}px`;
      }
    }
    function handleMouseUp(e) {
      if (scalingTree) {
        setScalingTree();
        localStorage.setItem("directoryTreeWidth", e.clientX - 45);
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
  }, [scalingTree, settings.showDirectoryTree]);
}
