import React, { useEffect, useState } from "react";
import formatDuration from "../../../../Helpers/FormatVideoTime";
import FormatDate from "../../../../Helpers/FormatDate";
import loading from "../../../../Assets/images/loading.png";
import close from "../../../../Assets/images/close.png";

export default function Properties({
  contextMenu,
  setShowProperties,
  setContextMenu,
}) {
  const [itemProperties, setItemProperties] = useState(contextMenu?.info);

  useEffect(() => {
    if (Object.entries(itemProperties)) {
      setContextMenu({});
    }
    if (itemProperties.isDirectory) {
      console.log(itemProperties);
      if (
        itemProperties.formattedSize &&
        itemProperties.formattedSize !== "0B"
      ) {
        return;
      }
      fetch("/api/directorydata/getdatedata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: itemProperties.path,
        }),
      })
        .then(async (res) => {
          const response = await res.json();
          setItemProperties((prevProps) => ({
            ...prevProps,
            ...response,
          }));
          fetch("/api/directorydata/getsize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: itemProperties.path,
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
  }, [itemProperties, setItemProperties]);

  let lastTimeAccessed = Math.abs(
    Math.round(
      (Date.now() - new Date(itemProperties.accessed).getTime()) / 1000 / 60
    )
  );

  return (
    <div id="file-properties">
      <img
        src={localStorage.getItem("close") || close}
        alt="close"
        onClick={() => {
          setShowProperties(false);
        }}
      />
      <p>Name: {itemProperties.name}</p>
      <p>Path: "{itemProperties.path}"</p>
      <div>
        Size:&nbsp;
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
