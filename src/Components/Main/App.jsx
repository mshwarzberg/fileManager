import React, { createContext, Fragment, useEffect, useState } from "react";

import DirectoryState from "./State/DirectoryState";
import UIandUXState from "./State/UIandUXState";

import Page from "../DirectoryPage/Page";
import Navbar from "../Navbar/Navbar";
import DirectoryTree from "../DirectoryTree/DirectoryTree";
import PageItem from "../DirectoryPage/PageItem";
import UIandUX from "./UIandUX";

import sortBy from "../../Helpers/SortBy";
import formatMetadata from "../../Helpers/FS and OS/FormatMetadata";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import randomID from "../../Helpers/RandomID";

export const GeneralContext = createContext();

const fs = window.require("fs");
const { execSync, exec } = window.require("child_process");

export default function App() {
  const {
    state,
    state: { currentDirectory, drive },
    dispatch,
  } = DirectoryState();

  const {
    settings,
    settings: { pageView },
    setSettings,
  } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState({});
  const [visibleItems, setVisibleItems] = useState([]);
  const [popup, setPopup] = useState({});
  const [clipboard, setClipboard] = useState({});
  const [drag, setDrag] = useState({});
  const [reload, setReload] = useState();
  const [viewTypeTabWidth, setViewTypeTabWidth] = useState({
    name: 14.5,
    modified: 12,
    type: 8,
    size: 5,
    duration: 5,
    dimensions: 5,
  });

  useEffect(() => {
    console.clear();
  }, []);

  useEffect(() => {
    async function updatePage() {
      if (drive && currentDirectory) {
        document.title = currentDirectory;
        let result = [];
        try {
          if (currentDirectory === "Trash") {
            setDirectoryItems(JSON.parse(localStorage.getItem("trash")) || []);
            return;
          } else {
            result = fs
              .readdirSync(currentDirectory, {
                withFileTypes: true,
              })
              .map((file) => {
                return formatMetadata(file, currentDirectory, drive);
              })
              .filter((item) => {
                return item.name && item;
              });
          }
          setDirectoryItems(result);
          sortBy(setDirectoryItems, "Name");
        } catch (e) {
          setPopup({
            show: true,
            body: (
              <div id="body">
                <h1 id="description">{e.toString()}</h1>
              </div>
            ),
            ok: (
              <button
                onClick={() => {
                  setPopup({});
                }}
              >
                OK
              </button>
            ),
          });
          dispatch({
            type: "back",
            value: "error",
          });
        }
      } else {
        exec(
          `wmic LogicalDisk where(DriveType=3) get Name,Size,VolumeName, FreeSpace, FileSystem`,
          (_, data) => {
            setDirectoryItems(formatDriveOutput(data));
          }
        );
      }
    }
    updatePage();
    // eslint-disable-next-line
  }, [currentDirectory, drive, reload]);

  useEffect(() => {
    if (!currentDirectory?.startsWith(drive) || !drive) {
      dispatch({
        type: "drive",
        value:
          currentDirectory === "Trash" ? drive : currentDirectory?.slice(0, 3),
      });
    }
  }, [currentDirectory]);

  useEffect(() => {
    document.body.className = settings.appTheme;
  }, [settings.appTheme]);

  const renderDirectoryItems = directoryItems.map((directoryItem) => {
    if (!directoryItem.name) {
      return <Fragment key={randomID()} />;
    }
    return (
      <PageItem
        key={directoryItem.key || directoryItem.name}
        lastSelected={[lastSelected, setLastSelected]}
        selectedItems={[selectedItems, setSelectedItems]}
        viewTypeTabWidth={viewTypeTabWidth}
        directoryItem={directoryItem}
        visibleItems={visibleItems}
        setDrag={setDrag}
      />
    );
  });

  return (
    <GeneralContext.Provider
      value={{
        state,
        dispatch,
        directoryItems,
        setDirectoryItems,
        settings,
        setSettings,
        renameItem,
        setRenameItem,
      }}
    >
      <Navbar setPopup={setPopup} drag={drag} />
      <DirectoryTree />
      <Page selectedItems={selectedItems} clipboard={clipboard} reload={reload}>
        {pageView === "details" && (
          <div className="details-view-buttons-container">
            <div
              className="details-view-button"
              style={{
                width: viewTypeTabWidth.name + "rem",
              }}
            >
              Name
            </div>
            <div
              className="details-view-button"
              style={{
                width: viewTypeTabWidth.modified + "rem",
              }}
            >
              Date Modified
            </div>
            <div
              className="details-view-button"
              style={{
                width: viewTypeTabWidth.type + "rem",
              }}
            >
              Type
            </div>
            <div
              className="details-view-button"
              style={{
                width: viewTypeTabWidth.size + "rem",
              }}
            >
              Size
            </div>
            <div
              className="details-view-button"
              style={{
                width: viewTypeTabWidth.duration + "rem",
              }}
            >
              Duration
            </div>
            <div
              className="details-view-button"
              style={{
                width: viewTypeTabWidth.dimensions + "rem",
              }}
            >
              Dimensions
            </div>
          </div>
        )}
        {renderDirectoryItems}
      </Page>
      <UIandUX
        visibleItems={[visibleItems, setVisibleItems]}
        lastSelected={[lastSelected, setLastSelected]}
        selectedItems={[selectedItems, setSelectedItems]}
        popup={[popup, setPopup]}
        clipboard={[clipboard, setClipboard]}
        drag={[drag, setDrag]}
        reload={[reload, setReload]}
      />
      {drag.x && drag.y && (
        <div
          id="drag-box"
          style={{
            left: drag.x + "px",
            top: drag.y + "px",
          }}
        >
          <p id="count">{selectedItems.length}</p>
          <div id="mode">
            {drag.mode ? (
              `
              + ${drag.mode === "move" ? "Move" : "Copy"} items to ${
                drag.destination
              }`
            ) : (
              <div id="not-allowed">
                <div id="line-through" />
              </div>
            )}
          </div>
        </div>
      )}
      <button
        style={{ position: "fixed", zIndex: 10 }}
        onClick={() => {
          window.location.reload(true);
          // function formatPowershellJSON(output) {
          //   output = output.toString();
          //   console.log(output);
          // }
          // exec(
          //   `powershell.exe ./PS1Scripts/DocumentMetadata.ps1 """${currentDirectory}"""`,
          //   (e, output) => {
          //     formatPowershellJSON(output);
          //   }
          // );
        }}
      >
        Test
      </button>
    </GeneralContext.Provider>
  );
}
