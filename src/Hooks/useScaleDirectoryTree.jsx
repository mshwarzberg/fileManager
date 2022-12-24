import { useEffect, useState, useContext } from "react";
import { GeneralContext } from "../Components/Main/Main.tsx";

export default function useScaleDirectoryTree() {
  const {
    settings: { showDirectoryTree },
    setViews,
  } = useContext(GeneralContext);

  const [scalingTree, setScalingTree] = useState();

  useEffect(() => {
    const scaleDirectoryTree = document.getElementById("directory-tree-scaler");
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
        setViews((prevViews) => ({
          ...prevViews,
          treeWidth: e.clientX,
        }));
      }
    }
    function handleMouseUp(e) {
      setScalingTree();
    }
    scaleDirectoryTree?.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      scaleDirectoryTree?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, [scalingTree, showDirectoryTree]);
}
