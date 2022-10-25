import { useState } from "react";

import formatDate from "../../Helpers/FormatDate";
import formatSize from "../../Helpers/FormatSize";
import formatTitle from "../../Helpers/FormatTitle";
import formatDuration from "../../Helpers/FormatVideoTime";

import CustomFileIcon from "../DirectoryPage/Icons/CustomFileIcon";

const exifr = window.require("exifr");

export default function BlockComparison({
  directoryItem,
  location,
  setChecked,
}) {
  const {
    thumbPath,
    name,
    size,
    modified,
    isMedia,
    filetype,
    path,
    key,
    isDirectory,
    fileextension,
    duration,
    isFile,
    isSymbolicLink,
  } = directoryItem;

  const [description, setDescription] = useState();

  return (
    <label
      key={key}
      className="block-container"
      data-title={formatTitle({ ...directoryItem, description: description })}
      onMouseEnter={() => {
        if (filetype === "image") {
          exifr
            .parse(path, true)
            .then((data) => {
              if (!data) {
                return;
              }
              const description =
                data.Comment || data.description?.value || data.description;
              setDescription(description);
            })
            .catch(() => {});
        }
      }}
    >
      <input
        type="checkbox"
        className={location}
        id={path}
        value={false}
        onChange={() => {
          setChecked((prevChecked) => {
            const locationArray = [...prevChecked[location]];
            if (!locationArray.includes(name)) {
              locationArray.push(name);
            } else {
              locationArray.splice(locationArray.indexOf(name), 1);
            }
            return {
              ...prevChecked,
              [location]: locationArray,
            };
          });
        }}
      />
      {thumbPath && isMedia ? (
        <>
          <img src={thumbPath} />
          {duration && (
            <div className="duration">{formatDuration(duration)}</div>
          )}
        </>
      ) : (
        isFile && (
          <CustomFileIcon fileextension={fileextension.split(".")[1] || ""} />
        )
      )}
      {(isDirectory || isSymbolicLink) && <img src={""} alt="folder" />}
      {size ? <p className="size">{formatSize(size)}</p> : <></>}
      <pre className="date">{formatDate(new Date(modified))}</pre>
    </label>
  );
}
