import { useContext, useState, useEffect } from "react";
import { GeneralContext } from "../../Main/Main";
import CustomFolderIcon from "../../DirectoryPage/Item/Icons/CustomFolderIcon";
const { exec } = window.require("child_process");
const { ipcRenderer } = window.require("electron");

export default function ArchivePopup({ selectedItems }) {
  const {
    views: { appTheme },
    directoryState: { currentDirectory, currentDirectoryName },
    setPopup,
  } = useContext(GeneralContext);

  const [archiveDestination, setArchiveDestination] =
    useState(currentDirectory);
  const [archiveType, setArchiveType] = useState("zip");
  const [archiveName, setArchiveName] = useState(currentDirectoryName);

  useEffect(() => {
    function addToArchive() {
      setPopup({});
      exec(
        `".\\resources\\7zip\\7za.exe" a "${
          archiveDestination + archiveName
        }.${archiveType}" "${selectedItems.join('" "')}"`,
        (e, _d) => {
          if (e) return console.log(e);
        }
      );
    }
    document
      .getElementById("ok-archive")
      .addEventListener("click", addToArchive);
    return () => {
      document
        .getElementById("ok-archive")
        ?.removeEventListener("click", addToArchive);
    };
  }, [archiveType, archiveName, archiveDestination]);

  return (
    <div id="archive-body">
      <label id="select-archive-destination">
        Archive Destination
        <CustomFolderIcon directoryPath={archiveDestination} />
        <button
          id="destination-selector"
          onClick={() => {
            ipcRenderer.once("open-file", (_event, data) => {
              if (!data) {
                return;
              }
              data += "/";
              setArchiveDestination(data?.replaceAll("\\", "/") || "");
            });
            ipcRenderer.send("archive", "open-file");
          }}
        >
          <p>{archiveDestination}</p>
        </button>
      </label>
      <br />
      <label>
        Archive Name&nbsp;
        <input
          spellCheck={false}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            setArchiveName(e.target.value);
          }}
          value={archiveName}
        />
      </label>
      <br />
      <label
        id="select-archive-type"
        onChange={(e) => {
          setArchiveType(e.target.name.toLowerCase());
        }}
      >
        Archive Type
        {["7Z", "ZIP", "TAR"].map((type) => {
          return (
            <label>
              <input
                type="radio"
                name={type}
                checked={archiveType === type.toLowerCase()}
                readOnly
              />
              {type}
            </label>
          );
        })}
      </label>
      <br />
      <label id="output-file-path">
        Output File:
        <pre data-title={selectedItems.join("\n")}>
          {"  " + archiveDestination + archiveName + "." + archiveType}
        </pre>
      </label>
    </div>
  );
}
