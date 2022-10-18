import { useContext, useState, Fragment, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import formatMetadata from "../../Helpers/FS and OS/GetMetadata";

import rightCaretImageWhite from "../../Images/right-caret-white.png";
import rightCaretImageBlack from "../../Images/right-caret-black.png";
import formatTitle from "../../Helpers/FormatTitle";

const fs = window.require("fs");

export default function CurrentDirectory() {
  const {
    state: { currentDirectory, drive },
    dispatch,
  } = useContext(DirectoryContext);

  const arrayifyCurrentDirectory = currentDirectory.split("/");

  const [showSubDirectories, setShowSubDirectories] = useState();

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
        let result = [];
        try {
          result = fs
            .readdirSync(path, { withFileTypes: true })
            .map((file) => {
              if (file.isDirectory()) {
                return formatMetadata(file, path, drive);
              }
            })
            .filter((item) => {
              return item?.name && item;
            });
        } catch (error) {
          console.error(error);
        }

        return (
          <div className="arrow-and-name-container">
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
            {result[0] && (
              <img
                src={rightCaretImageWhite}
                onMouseEnter={(e) => {
                  e.target.src = rightCaretImageBlack;
                }}
                onMouseLeave={(e) => {
                  e.target.src = rightCaretImageWhite;
                }}
                onClick={() => {
                  if (showSubDirectories === path) {
                    setShowSubDirectories();
                  } else {
                    setShowSubDirectories(path);
                  }
                }}
              />
            )}
            {showSubDirectories === path && (
              <div className="sub-directories">
                {result.map((item) => {
                  return (
                    <button
                      onClick={() => {
                        dispatch({
                          type: "open",
                          value: item.path + "/",
                        });
                        setShowSubDirectories();
                      }}
                      data-title={formatTitle(item)}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      return <Fragment key={index} />;
    }
  );

  return <div id="current-directory">{renderDirectoryButtons}</div>;
}
