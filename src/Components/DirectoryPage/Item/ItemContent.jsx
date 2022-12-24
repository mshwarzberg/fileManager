import { useContext } from "react";
import CustomDriveIcon from "./Icons/CustomDriveIcon";
import CustomFileIcon from "./Icons/CustomFileIcon";
import CustomFolderIcon from "./Icons/CustomFolderIcon";
import formatDuration from "../../../Helpers/FormatVideoTime";
import { GeneralContext } from "../../Main/Main.tsx";

export default function ItemContent({
  thumbnail: [thumbnail, setThumbnail],
  directoryItem,
}) {
  const {
    views: { pageView, iconSize },
    settings: { showThumbnails },
  } = useContext(GeneralContext);

  const {
    isFile,
    fileextension,
    duration,
    isDirectory,
    isSymbolicLink,
    path,
    isDrive,
    isMedia,
  } = directoryItem;

  if (
    thumbnail &&
    showThumbnails &&
    isMedia &&
    pageView !== "list" &&
    pageView !== "details"
  ) {
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
