import React, { useEffect, useState, useContext } from "react";
import formatVideoTime from "../../../../Helpers/FormatVideoTime";
import FormatDate from "../../../../Helpers/FormatDate";
import close from "../../../../Assets/images/close.png";
import FormatSize from "../../../../Helpers/FormatSize";
import { UIContext } from "../../GeneralUI";

export default function Properties({ setShowProperties }) {
  const { setContextMenu, contextMenu } = useContext(UIContext);
  const [itemProperties, setItemProperties] = useState(contextMenu?.info);

  useEffect(() => {
    if (Object.entries(itemProperties)) {
      setContextMenu({});
    }
    if (itemProperties.isDirectory) {
      if (
        itemProperties.formattedSize &&
        itemProperties.formattedSize !== "0B"
      ) {
        return;
      }
      // fetch("/api/directorydata/getdatedata", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     path: itemProperties.path,
      //     name: itemProperties.name,
      //   }),
      // })
      //   .then(async (res) => {
      //     const response = await res.json();
      //     setItemProperties((prevProps) => ({
      //       ...prevProps,
      //       ...response,
      //     }));
      //     fetch("/api/directorydata/getsize", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         path: itemProperties.path,
      //       }),
      //     })
      //       .then(async (res) => {
      //         const response = await res.json();

      //         setItemProperties((prevProps) => ({
      //           ...prevProps,
      //           size: response.bytes,
      //           formattedSize: FormatSize(response.bytes),
      //           count: `(${response.filecount + response.foldercount} items, ${
      //             response.filecount
      //           } files, ${response.foldercount} folders)`,
      //         }));
      //       })
      //       .catch((e) => {});
      //   })
      //   .catch((e) => {
      //     console.log("FileProperties.jsx directorydata", e);
      //   });
    }
    // eslint-disable-next-line
  }, [itemProperties, setItemProperties]);

  const lastTimeAccessed = Math.abs(
    Math.round(
      (Date.now() - new Date(itemProperties.accessed).getTime()) / 1000 / 60
    )
  );
  const formattedSize =
    itemProperties.formattedSize || FormatSize(itemProperties.size);
  return (
    <div id="file-properties">
      <img
        src={localStorage.getItem("close") || close}
        alt="close"
        onClick={() => {
          setShowProperties(false);
        }}
      />
      <div>
        <p>Name: {itemProperties.name}</p>
      </div>
      <div>
        <p>Path: "{itemProperties.path}"</p>
      </div>
      <div>
        Size:&nbsp;
        {formattedSize ? formattedSize : <img src={""} alt="" id="loading" />}
        {itemProperties.count && <p>&nbsp;&nbsp;{itemProperties.count}</p>}
      </div>
      {itemProperties.duration && (
        <div>
          <p>Length: {formatVideoTime(itemProperties.duration)}</p>
        </div>
      )}
      {itemProperties.width && itemProperties.height && (
        <div>
          <p>
            Dimensions: {`${itemProperties.width}x${itemProperties.height}`}
          </p>
        </div>
      )}
      <div>
        {" "}
        <p> Date Created: {FormatDate(new Date(itemProperties.created))}</p>
      </div>
      <div>
        <p> Date Modified: {FormatDate(new Date(itemProperties.modified))}</p>
      </div>
      <div>
        {" "}
        <p>
          Date Accessed: {FormatDate(new Date(itemProperties.accessed))}
          {lastTimeAccessed < 60 && " (" + lastTimeAccessed + " minutes ago)"}
        </p>
      </div>
    </div>
  );
}
