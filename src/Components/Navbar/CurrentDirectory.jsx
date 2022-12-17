import { useContext, useState, Fragment } from "react";
import { GeneralContext } from "../Main/Main";
import formatMetadata from "../../Helpers/FS and OS/FormatMetadata";

import formatTitle from "../../Helpers/FormatTitle";

const fs = window.require("fs");

export default function CurrentDirectory({ drag, setPopup }) {
  const {
    state: { currentDirectory, drive },
    views: { appTheme },
    dispatch,
  } = useContext(GeneralContext);

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
        } catch (e) {}

        return (
          <div
            className="arrow-and-name-container"
            key={index}
            onMouseLeave={() => {
              setShowSubDirectories();
            }}
          >
            <button
              className={`button-${appTheme}`}
              onClick={() => {
                dispatch({
                  type: "open",
                  value: path,
                });
              }}
              data-destination={path}
            >
              {directory}
            </button>
            {result[0] && (
              <button
                className={`directory-arrow button-${appTheme}`}
                onClick={() => {
                  if (showSubDirectories === path) {
                    setShowSubDirectories();
                  } else {
                    setShowSubDirectories(path);
                  }
                }}
                onMouseEnter={() => {
                  if (drag) {
                    if (showSubDirectories === path) {
                      setShowSubDirectories();
                    } else {
                      setShowSubDirectories(path);
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.relatedTarget?.className !== "sub-directory-button") {
                    setShowSubDirectories();
                  }
                }}
              >
                {showSubDirectories === path ? "↓" : "→"}
              </button>
            )}
            {showSubDirectories === path && (
              <div className="sub-directories">
                {result.map((item) => {
                  return (
                    <button
                      key={item.path}
                      className="sub-directory-button"
                      onClick={() => {
                        dispatch({
                          type: "open",
                          value: item.path + "/",
                        });
                        setShowSubDirectories();
                      }}
                      data-destination={item.path + "/"}
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
