import { useContext, useState } from "react";
import { GeneralContext } from "../../Main/Main";
import CustomFolderIcon from "../../DirectoryPage/Item/Icons/CustomFolderIcon";
const { ipcRenderer } = window.require("electron");

export default function ArchivePopup({ cacheSelectedItems }) {
  const [destinationDirectory, setDestinationDirectory] = useState("");

  const {
    views: { appTheme },
  } = useContext(GeneralContext);

  return (
    <div id="archive-body">
      <div
        id="destination-selector"
        data-title="Select destination for archive"
        onClick={() => {
          ipcRenderer.once("open-file", (_event, data) => {
            if (data) {
              data += "/";
            }
            setDestinationDirectory(data?.replaceAll("\\", "/") || "");
          });
          ipcRenderer.send("archive", "open-file");
        }}
      >
        <CustomFolderIcon directoryPath={destinationDirectory} />
        <p>{destinationDirectory}</p>
      </div>
    </div>
  );
}
