import React, { createContext, Fragment, useEffect, useState } from "react";

import DirectoryState from "./State/DirectoryState";
import UIandUXState from "./State/UIandUXState";

import Page from "../DirectoryPage/Page";
import DetailsView from "../DirectoryPage/DetailsView/DetailsView";

import Navbar from "../Navbar/Navbar";
import DirectoryTree from "../DirectoryTree/DirectoryTree";
import PageItem from "../DirectoryPage/PageItem";
import UIandUX from "./UIandUX";

import sortDirectoryItems from "../../Helpers/Sort";
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
    settings: { pageView, detailsTabWidth },
    setSettings,
  } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState({});
  const [popup, setPopup] = useState({});
  const [clipboard, setClipboard] = useState({});
  const [drag, setDrag] = useState({});
  const [reload, setReload] = useState();
  const [loading, setLoading] = useState();

  const [viewTypes, setViewTypes] = useState([
    "Name",
    "Modified",
    "Type",
    "Size",
    "Dimensions",
    "Duration",
  ]);

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
          sortDirectoryItems(setDirectoryItems, "name", true);
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
        setLoading();
      } else {
        exec(
          `wmic LogicalDisk where(DriveType=3) get Name,Size,VolumeName, FreeSpace, FileSystem`,
          (_, data) => {
            setDirectoryItems(formatDriveOutput(data));
            setLoading();
          }
        );
      }
    }
    setLoading(true);
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
        detailsTabWidth={detailsTabWidth}
        directoryItem={directoryItem}
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
      <Page
        selectedItems={[selectedItems, setSelectedItems]}
        clipboard={clipboard}
        reload={reload}
        loading={[loading, setLoading]}
        setLastSelected={setLastSelected}
      >
        {pageView === "details" && (
          <DetailsView
            detailsTabWidth={detailsTabWidth}
            viewTypes={viewTypes}
            setDirectoryItems={setDirectoryItems}
            setSettings={setSettings}
          />
        )}
        {renderDirectoryItems}
      </Page>
      <UIandUX
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
