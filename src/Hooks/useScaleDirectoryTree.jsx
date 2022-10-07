import { useEffect, useState, useContext } from "react";
import { DirectoryContext } from "../Components/Main/App";

export default function useScaleDirectoryTree() {
  const [scalingTree, setScalingTree] = useState();
  const { settings, setSettings } = useContext(DirectoryContext);

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
        setSettings((prevSettings) => ({
          ...prevSettings,
          treeWidth: e.clientX,
        }));
      }
    }
    function handleMouseUp(e) {
      setScalingTree();
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
