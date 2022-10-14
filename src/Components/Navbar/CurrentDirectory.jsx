import { useContext, Fragment } from "react";
import { DirectoryContext } from "../Main/App";

export default function CurrentDirectory() {
  const {
    state: { currentDirectory },
    dispatch,
  } = useContext(DirectoryContext);

  const arrayifyCurrentDirectory = currentDirectory.split("/");

  const renderDirectoryButtons = arrayifyCurrentDirectory.map(
    (directory, index) => {
      if (directory) {
        let path = "";
        for (let i in arrayifyCurrentDirectory) {
          path += arrayifyCurrentDirectory[i] + "/";
          if (i == index) {
            break;
          }
        }
        return (
          <button
            key={index}
            onClick={() => {
              dispatch({
                type: "open",
                value: path,
              });
            }}
          >
            {directory}
          </button>
        );
      }
      return <Fragment key={index} />;
    }
  );

  return <div id="current-directory">{renderDirectoryButtons}</div>;
}
