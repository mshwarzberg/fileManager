import React, { useContext, useRef } from "react";
import { DirectoryStateContext } from "../../../../App";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
import useFetch from "../../../../Hooks/useFetch";
import ParentDirectoriesToArray from "../../../../Helpers/ParentDirectoriesToArray";
import RightArrowBlack from "../../../../Assets/images/directorytree/right-arrow-black.png";
import RightArrowWhite from "../../../../Assets/images/directorytree/right-arrow-white.png";
import RightArrowAccented from "../../../../Assets/images/directorytree/right-arrow-accented.png";
import FolderIcon from "../../../../Assets/images/folder.png";
// import { RenderPath, IsLastInArray } from "../../../../Helpers/RenderPath";
// import HoverOverPathID from "../../../../Helpers/HoverOverPathID";

export default function ChildDir(props) {
  const { addToPath, subItem } = props;
  const { state, dispatch } = useContext(DirectoryStateContext);
  const childPosition = useRef();

  const { data: directories } = useFetch(
    "/api/getdirectories",
    JSON.stringify({ path: `./root${addToPath && "/" + addToPath}/${subItem}` })
  );

  const changeItem = useUpdateDirectoryTree();
  function expandDirectory(toOpenDirectory) {
    // if a user clicks on the down caret don't open the directory. Instead just expand to the child directories
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: `./root${addToPath && "/" + addToPath}/${subItem}`,
      });
    }

    if (directories) {
      dispatch({
        type: "updateDirectoryTree",
        value: changeItem(
          state.directoryTree,
          ParentDirectoriesToArray(`${addToPath}${subItem && "/" + subItem}`),
          0,
          directories.array
        ),
      });
    }
  }

  // function renderPathLine() {
  //   if (
  // /    !RenderPath(subItem, `${addToPath}/${subItem}`, state.currentDirectory) ||
  // /    !IsLastInArray(state.currentDirectory, subItem)
  //   ) {
  //     return;
  //   }
  //   return true;
  // }

  return (
    <>
      {/* {renderPathLine() && childPosition?.current?.id && (
        <div className="path--identifier-container">
          {
            <div
              className="path--identifier-line"
              style={{
                height: childPosition.current.offsetTop - 5,
                left: props.treeID?.current?.offsetLeft + 18,
                top: 31,
              }}
              onMouseEnter={() => {
                HoverOverPathID(".path--identifier-container", true);
              }}
              onMouseLeave={() => {
                HoverOverPathID(".path--identifier-container");
              }}
            />
          }
        </div>
      )} */}
      <div
        ref={childPosition}
        onClick={(e) => {
          expandDirectory(true);
          e.stopPropagation();
        }}
        className="tree--closed-directory"
        id={
          `./root${addToPath && "/" + addToPath}/${subItem}` ===
          state.currentDirectory
            ? "highlight--child"
            : ""
        }
        title={`Name: ${subItem}\nPath: ${`./root${
          addToPath && "/" + addToPath
        }/${subItem}`}`}
      >
        <img
          onMouseEnter={(e) => {
            if (`./root/${addToPath}/${subItem}` !== state.currentDirectory) {
              return (e.target.src = RightArrowAccented);
            }
          }}
          onMouseLeave={(e) => {
            if (`./root/${addToPath}/${subItem}` !== state.currentDirectory) {
              return (e.target.src = RightArrowWhite);
            }
          }}
          onClick={(e) => {
            expandDirectory(false);
            e.stopPropagation();
          }}
          className="tree--arrow"
          src={
            `./root/${addToPath}/${subItem}` === state.currentDirectory
              ? RightArrowBlack
              : RightArrowWhite
          }
          alt=""
        />
        <img src={FolderIcon} alt="" className="folder--icon" />
        {subItem}
      </div>
    </>
  );
}
