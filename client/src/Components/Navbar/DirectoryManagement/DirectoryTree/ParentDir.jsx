import React, { useContext, useEffect, useRef, useState } from "react";

import DownArrowBlack from "../../../../Assets/images/down-arrow-black.png";
import DownArrowAccented from "../../../../Assets/images/down-arrow-accented.png";
import DownArrowWhite from "../../../../Assets/images/down-arrow-white.png";

import FolderIcon from "../../../../Assets/images/folder.png";
import ParentDirectoriesToArray from "../../../../Helpers/ParentDirectoriesToArray";
import { IsLastInArray, RenderPath } from "../../../../Helpers/RenderPath";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";

import { DirectoryStateContext } from "../../../../App";

export default function ParentDir(props) {
  const { openDirectoryName, openDirectory, path } = props;
  const parentPosition = useRef();
  const changeItem = useUpdateDirectoryTree();
  const { state, dispatch } = useContext(DirectoryStateContext);

  const [highlightedLine, setHighlightedLine] = useState({
    height: 0,
    top: 0,
  });

  useEffect(() => {
    if (parentPosition.current.id) {
      // position relative to the previous parent element
      setHighlightedLine({
        height: parentPosition.current.offsetParent.offsetTop - 15,
        top: -parentPosition.current.offsetParent.offsetTop + 31,
      });
    }
  }, [parentPosition]);

  return (
    <div className="tree--expanded-chunk">
      <div className="line--down" />

      {RenderPath(
        openDirectoryName,
        `${path}/${openDirectoryName}`,
        state.currentDirectory
      ) && (
        <>
          {(IsLastInArray(state.currentDirectory, openDirectoryName) ||
            RenderPath(
              openDirectoryName,
              `${path}/${openDirectoryName}`,
              state.currentDirectory
            )) && (
            <div
              id="path--identifier-line-parent"
              style={{
                height: highlightedLine.height,
                top: highlightedLine.top,
              }}
            />
          )}
          <div id="path--identifier-curve" />
        </>
      )}
      <p
        ref={parentPosition}
        className="tree--open-directory"
        title={`./root${path && "/" + path}/${openDirectoryName}`}
        onMouseEnter={(e) => {
          if (
            `./root${path && "/" + path}/${openDirectoryName}` !==
            state.currentDirectory
          ) {
            e.currentTarget.firstChild.src = DownArrowWhite;
          }
        }}
        onMouseLeave={(e) => {
          if (
            `./root${path && "/" + path}/${openDirectoryName}` !==
            state.currentDirectory
          ) {
            e.currentTarget.firstChild.src = DownArrowBlack;
          }
        }}
        id={
          `./root${path && "/" + path}/${openDirectoryName}` ===
          state.currentDirectory
            ? "highlight--child"
            : RenderPath(
                openDirectoryName,
                `${path}/${openDirectoryName}`,
                state.currentDirectory
              )
            ? "tree--in-path"
            : ""
        }
        onClick={() => {
          dispatch({
            type: "openDirectory",
            value: `./root${path && "/" + path}/${openDirectoryName}`,
          });
        }}
      >
        <img
          onMouseEnter={(e) => {
            if (
              `./root${path && "/" + path}/${openDirectoryName}` !==
              state.currentDirectory
            ) {
              e.target.src = DownArrowAccented;
            }
          }}
          onMouseLeave={(e) => {
            if (
              `./root${path && "/" + path}/${openDirectoryName}` !==
              state.currentDirectory
            ) {
              e.target.src = DownArrowWhite;
            }
          }}
          onClick={(e) => {
            dispatch({
              type: "updateDirectoryTree",
              value: changeItem(
                state.directoryTree,
                ParentDirectoriesToArray(`${path}/${openDirectoryName}`),
                0,
                openDirectoryName
              ),
            });
            e.stopPropagation();
          }}
          className="tree--arrow"
          src={DownArrowBlack}
          alt="close tree"
        />
        <img src={FolderIcon} alt="folder" className="folder--icon" />
        {openDirectoryName}
      </p>
      <div className="opendirectory--list">{openDirectory}</div>
    </div>
  );
}
