import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import ColorizeIcons from "../../../Helpers/ColorizeIcons";
import folder from "../../../Assets/images/folder.png";
import symlink from "../../../Assets/images/symlink.png";
import Filename from "./Filename";

function Icon(props) {
  const { dispatch } = useContext(DirectoryContext);

  const { item, index } = props;
  const {
    name,
    shorthandsize,
    fileextension,
    thumbnail,
    isFile,
    permission,
    isDirectory,
    path,
    isSymbolicLink,
    linkTo,
  } = item;

  return (
    !thumbnail && (
      <>
        <div
          className="renderitem--block"
          title={`Name: ${name}${
            shorthandsize ? "\nSize: " + shorthandsize : ""
          }\nType: ${fileextension}\nPath: ${path}\n${
            !permission ? "NO ACCESS" : ""
          }`}
          onClick={() => {
            if (isDirectory && permission && !isSymbolicLink) {
              dispatch({
                type: "openDirectory",
                value: path,
              });
            }
            if (isSymbolicLink && permission) {
              dispatch({
                type: "openDirectory",
                value: `${linkTo}`,
              });
            }
          }}
          style={{
            cursor: !permission ? "not-allowed" : "pointer",
            backgroundColor: !permission ? "#ff7878c5" : "",
            border: !permission ? "1.5px solid red" : "",
          }}
        >
          {isFile ? (
            <svg
              viewBox="0 0 100 100"
              style={{ position: "absolute" }}
              className="svg--icon"
              data-index={index}
            >
              <rect
                fill="#bbbbbb"
                x="12.5"
                y="-5"
                width="75"
                height="100"
                clipPath="polygon(100% 0, 100% 75%, 69% 100%, 0 100%, 0 0)"
                className="svg--icon"
                data-index={index}
              />
              <rect
                x="4.5"
                y="20"
                width="50"
                height="25"
                fill={ColorizeIcons(fileextension)}
                rx="1"
                ry="1"
                className="svg--icon"
              />
              <rect
                width="25"
                height="25"
                fill="white"
                y="70"
                x="63.8"
                clipPath="polygon(0 0, 0% 100%, 94% 0)"
                className="svg--icon"
                data-index={index}
              />
              <rect
                width="25"
                height="25"
                fill="#9f9f9f"
                y="70"
                x="38.8"
                clipPath="polygon(100% 0, 0% 100%, 100% 100%)"
                className="svg--icon"
                data-index={index}
              />
              <text
                fill={
                  ColorizeIcons(fileextension) === "white" ? "black" : "white"
                }
                x="30"
                y={fileextension.length > 4 ? "36" : "40"}
                className="custom-icon-text"
                data-index={index}
                style={{
                  fontSize: fileextension.length > 4 ? "0.6em" : "1.3em",
                }}
              >
                {fileextension.toUpperCase()}
              </text>
            </svg>
          ) : (
            <img
              src={
                isSymbolicLink
                  ? localStorage.getItem("symlink") || symlink
                  : localStorage.getItem("folder") || folder
              }
              alt="fileicon"
              className="renderitem--full-icon"
              data-index={index}
            />
          )}
          <Filename name={name} />
        </div>
      </>
    )
  );
}

export default Icon;
