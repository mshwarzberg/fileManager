import React, { useContext, useEffect, useState, useRef } from "react";
import formatDuration from "../../../Helpers/FormatVideoTime";
import { DirectoryContext } from "../../Main/App";
import FormatDate from "../../../Helpers/FormatDate";
import loading from "../../../Assets/images/loading.png";
import useDrag from "../../../Hooks/useDrag";

export default function FileProperties({
  setShowProperties,
  setContextMenu,
  contextMenu,
}) {
  const [itemProperties, setItemProperties] = useState({});
  const { directoryItems } = useContext(DirectoryContext);

  const properties = useRef();
  const { setIsDragging, onMouseMove } = useDrag(properties.current, true);

  useEffect(() => {
    if (contextMenu.targetIndex) {
      setItemProperties(directoryItems[contextMenu.targetIndex]);
      setContextMenu({});
    } else if (contextMenu.targetPath) {
      fetch("/api/directorydata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: contextMenu.targetPath,
        }),
      })
        .then(async (res) => {
          setContextMenu({});
          const response = await res.json();
          setItemProperties((prevProps) => ({
            ...prevProps,
            ...response,
          }));
          fetch("/api/directorydata/getsize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: contextMenu.targetPath,
            }),
          })
            .then(async (res) => {
              const response = await res.json();
              setItemProperties((prevProps) => ({
                ...prevProps,
                formattedSize: response.bytes,
                count: `(${response.filecount + response.foldercount} items, ${
                  response.filecount
                } files, ${response.foldercount} folders)`,
              }));
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log("FileProperties.jsx directorydata", e);
        });
    }
    // eslint-disable-next-line
  }, [contextMenu]);

  let lastTimeAccessed = Math.abs(
    Math.round(
      (Date.now() - new Date(itemProperties.accessed).getTime()) / 1000 / 60
    )
  );

  return (
    <div
      id="file-properties"
      ref={properties}
      onMouseDown={() => {
        setIsDragging(true);
      }}
      onMouseUp={() => {
        setIsDragging(false);
        document.removeEventListener("mousemove", onMouseMove);
      }}
    >
      <button
        onClick={() => {
          setShowProperties(false);
        }}
      >
        X
      </button>
      <p id="name">Name: {itemProperties.name}</p>
      <p id="grow">Path: "{itemProperties.path}"</p>
      <div>
        Size:{" "}
        {itemProperties.formattedSize ? (
          itemProperties.formattedSize
        ) : (
          <img src={loading} alt="" id="loading" />
        )}
        {itemProperties.count && <p>&nbsp;&nbsp;{itemProperties.count}</p>}
      </div>
      {itemProperties.duration && (
        <p>Length: {formatDuration(itemProperties.duration)}</p>
      )}
      {itemProperties.width && itemProperties.height && (
        <p>Dimensions: {`${itemProperties.width}x${itemProperties.height}`}</p>
      )}
      <p> Date Created: {FormatDate(new Date(itemProperties.created))}</p>
      <p> Date Modified: {FormatDate(new Date(itemProperties.modified))}</p>
      <p>
        Date Accessed: {FormatDate(new Date(itemProperties.accessed))}
        {lastTimeAccessed < 60 && " (" + lastTimeAccessed + " minutes ago)"}
      </p>
    </div>
  );
}
