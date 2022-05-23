import React, { useContext, useRef } from "react";
// import { useEffect, useState } from "react";
import DownArrowBlack from "../../../../Assets/images/directorytree/down-arrow-black.png";
import DownArrowAccented from "../../../../Assets/images/directorytree/down-arrow-accented.png";
import DownArrowWhite from "../../../../Assets/images/directorytree/down-arrow-white.png";

import FolderIcon from "../../../../Assets/images/folder.png";
import ParentDirectoriesToArray from "../../../../Helpers/ParentDirectoriesToArray";
import { RenderPath } from "../../../../Helpers/RenderPath";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
// import { IsLastInArray } from "../../../../Helpers/RenderPath";
import { DirectoryStateContext } from "../../../../App";

export default function ParentDir(props) {
  const { openDirectoryName, openDirectory, path, HoverOverPathID } = props;
  const parentPosition = useRef();
  const changeItem = useUpdateDirectoryTree();
  const { state, dispatch } = useContext(DirectoryStateContext);

  // const [highlightedLine, setHighlightedLine] = useState({
  //   height: 0,
  //   top: 0,
  // });

  const isInPath = RenderPath(
    openDirectoryName,
    `${path}/${openDirectoryName}`,
    state.currentDirectory
  );

  // useEffect(() => {
  //   if (parentPosition.current.id) {
  //     // position relative to the previous parent element
  //     setHighlightedLine({
  //       height: parentPosition.current.offsetParent.offsetTop - 15,
  //       top: -parentPosition.current.offsetParent.offsetTop + 31,
  //     });
  //   }
  // }, [parentPosition]);

  return (
    <div className="tree--expanded-chunk">
      <div className="line--down" />

      {/* {isInPath && (
        <div className="path--identifier-container">
          {(IsLastInArray(state.currentDirectory, openDirectoryName) ||
            isInPath) && (
            <div
              className="path--identifier-line"
              style={{
                height: highlightedLine.height,
                top: highlightedLine.top,
                left: props.treeID?.current?.offsetLeft - 2 || 1,
              }}
              onMouseEnter={() => {
                HoverOverPathID(".path--identifier-container", true);
              }}
              onMouseLeave={() => {
                HoverOverPathID(".path--identifier-container");
              }}
            />
          )}
          <div
            className="path--identifier-curve"
            style={{
              position: "absolute",
              left: props.treeID?.current?.offsetLeft - 2 || 1,
              width: 22,
              height: 32,
            }}
            onMouseEnter={() => {
              HoverOverPathID(".path--identifier-container", true);
            }}
            onMouseLeave={() => {
              HoverOverPathID(".path--identifier-container");
            }}
          />
        </div>
      )} */}
      <p
        ref={parentPosition}
        className="tree--open-directory"
        title={`./root${path && "/" + path}/${openDirectoryName}`}
        onMouseEnter={(e) => {
          if (
            `./root${path && "/" + path}/${openDirectoryName}` !==
              state.currentDirectory &&
            e.currentTarget.id !== "tree--in-path"
          ) {
            e.currentTarget.firstChild.src = DownArrowWhite;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.src = DownArrowBlack;
        }}
        id={
          `./root${path && "/" + path}/${openDirectoryName}` ===
          state.currentDirectory
            ? "highlight--child"
            : isInPath
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
                state.currentDirectory &&
              e.currentTarget.offsetParent.id !== "tree--in-path"
            ) {
              e.target.src = DownArrowAccented;
            }
          }}
          onMouseLeave={(e) => {
            if (
              `./root${path && "/" + path}/${openDirectoryName}` !==
              state.currentDirectory && e.currentTarget.offsetParent.id !== 'tree--in-path'
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
