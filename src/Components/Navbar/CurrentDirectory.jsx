import { useContext, useState, Fragment } from "react";
import { GeneralContext } from "../Main/App";
import formatMetadata from "../../Helpers/FS and OS/GetMetadata";

import formatTitle from "../../Helpers/FormatTitle";

const fs = window.require("fs");

export default function CurrentDirectory() {
  const {
    state: { currentDirectory, drive },
    settings: { appTheme },
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
        } catch (error) {
          console.error(error);
        }

        return (
          <div className="arrow-and-name-container">
            <button
              className={`button-${appTheme}`}
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
              <button className={`directory-arrow button-${appTheme}`}>
                <img
                  src={""}
                  onClick={() => {
                    if (showSubDirectories === path) {
                      setShowSubDirectories();
                    } else {
                      setShowSubDirectories(path);
                    }
                  }}
                />
              </button>
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
