import CustomDriveIcon from "../Components/DirectoryPage/Icons/CustomDriveIcon";
import CustomFileIcon from "../Components/DirectoryPage/Icons/CustomFileIcon";
import CustomFolderIcon from "../Components/DirectoryPage/Icons/CustomFolderIcon";
import formatDuration from "./FormatVideoTime";

export default function blockContent(
  directoryItem,
  showThumbnails,
  iconSize,
  [thumbnail, setThumbnail],
  pageView = "icon"
) {
  const {
    isMedia,
    isDirectory,
    isSymbolicLink,
    fileextension,
    duration,
    isDrive,
    path,
    isFile,
  } = directoryItem;

  if (thumbnail && showThumbnails && isMedia) {
    return (
      <div className="media-container">
        <img
          src={thumbnail}
          className="media-thumbnail"
          style={{
            ...(pageView === "icon" && {
              maxHeight: iconSize * (9 / 10) + "rem",
            }),
          }}
          onError={() => {
            setThumbnail();
          }}
        />
        {duration && <div className="duration">{formatDuration(duration)}</div>}
      </div>
    );
  } else if (isFile) {
    return <CustomFileIcon fileextension={fileextension.split(".")[1]} />;
  } else if (isDirectory || isSymbolicLink) {
    return <CustomFolderIcon directoryPath={path + "/"} />;
  } else if (isDrive) {
    return <CustomDriveIcon directoryItem={directoryItem} />;
  }
}
