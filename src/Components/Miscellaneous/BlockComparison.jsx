import { useState } from "react";

import formatDate from "../../Helpers/FormatDate";
import formatSize from "../../Helpers/FormatSize";
import formatTitle from "../../Helpers/FormatTitle";
import formatDuration from "../../Helpers/FormatVideoTime";

import CustomFileIcon from "../DirectoryPage/Icons/CustomFileIcon";
import CustomFolderIcon from "../DirectoryPage/Icons/CustomFolderIcon";

export default function BlockComparison({
  directoryItem,
  location,
  checked,
  handleChecked,
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
    prefix,
  } = directoryItem;

  return (
    <label
      key={key}
      className="block-container"
      data-title={formatTitle(directoryItem)}
    >
      <input
        type="checkbox"
        className={location}
        checked={checked[location].includes(prefix + "\\:" + fileextension)}
        onChange={() => {
          handleChecked(prefix + "\\:" + fileextension, location);
        }}
      />
      {thumbPath && isMedia ? (
        <>
          <img src={thumbPath} alt={path} />
          {duration && (
            <div className="duration">{formatDuration(duration)}</div>
          )}
        </>
      ) : (
        isFile && <CustomFileIcon fileextension={fileextension.split(".")[1]} />
      )}
      {(isDirectory || isSymbolicLink) && (
        <CustomFolderIcon directoryPath={path} />
      )}
      {size ? <p className="size">{formatSize(size)}</p> : <></>}
      <pre className="date">{formatDate(new Date(modified))}</pre>
    </label>
  );
}
