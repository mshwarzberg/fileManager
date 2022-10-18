import formatDate from "../../Helpers/FormatDate";
import formatSize from "../../Helpers/FormatSize";
import formatTitle from "../../Helpers/FormatTitle";
import formatDuration from "../../Helpers/FormatVideoTime";
import CustomIcon from "../DirectoryPage/Icons/CustomIcon";

import folderImage from "../../Images/folder.png";

export default function BlockComparison({ directoryItem }) {
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
    prefix,
    fileextension,
    duration,
    isFile,
    isSymbolicLink,
  } = directoryItem;

  return (
    <div
      key={key}
      className="block-container"
      data-title={formatTitle(directoryItem)}
    >
      <input type="checkbox" name={name} />
      {thumbPath && isMedia ? (
        <>
          <img src={thumbPath} />
          {duration && (
            <div className="duration">{formatDuration(duration)}</div>
          )}
        </>
      ) : (
        isFile && (
          <CustomIcon fileextension={fileextension.split(".")[1] || ""} />
        )
      )}
      {(isDirectory || isSymbolicLink) && (
        <img src={folderImage} alt="folder" />
      )}
      {size ? <p className="size">{formatSize(size)}</p> : <></>}
      <pre className="date">{formatDate(new Date(modified))}</pre>
    </div>
  );
}
