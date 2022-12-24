import React, { createContext, Fragment, useEffect, useState } from "react";

import DirectoryState from "./State/DirectoryState";
import SettingsState from "./State/SettingsState";
import ViewsState from "./State/ViewsState.tsx";

import Page from "../DirectoryPage/Page";
import DetailsView from "../DirectoryPage/Views/DetailsView";

import Navbar from "../Navbar/Navbar.tsx";
import DirectoryTree from "../DirectoryTree/DirectoryTree";
import PageItem from "../DirectoryPage/Item/PageItem";
import UIandUX from "./UIandUX";
import Title from "../Miscellaneous/Title";

import sortDirectoryItems from "../../Helpers/Sort";
import formatMetadata from "../../Helpers/FS and OS/FormatMetadata";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import formatTrash from "../../Helpers/FS and OS/FormatTrash";

import randomID from "../../Helpers/RandomID";

export const GeneralContext = createContext();

const fs = window.require("fs");
const { execSync, exec } = window.require("child_process");

interface DirectoryItem {
  accessed: number;
  bitrate: number;
  created: number;
  dimensions: string;
  displayLocation: string;
  displayName: string;
  displayPath: string;
  duration: number;
  fileextension: string;
  height: number;
  width: number;
  filetype: string;
  isFile: boolean;
  isDirectory: boolean;
  isDrive: boolean;
  isMedia: boolean;
  isSymbolicLink: boolean;
  name: string;
  path: string;
}

export default function Main() {
  const {
    state,
    state: { currentDirectory, drive },
    dispatch,
  } = DirectoryState();

  const { settings, setSettings } = SettingsState();

  const {
    views,
    views: { pageView, detailsTabWidth },
    setViews,
  } = ViewsState();

  const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState({});
  const [popup, setPopup] = useState({});
  const [clipboard, setClipboard] = useState({});
  const [drag, setDrag] = useState({});
  const [reload, setReload] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState({});

  useEffect(() => {
    console.clear();
    execSync(
      "powershell.exe Set-ExecutionPolicy RemoteSigned -Scope CurrentUser"
    );
  }, []);

  useEffect(() => {
    function updatePage() {
      if (currentDirectory === "Trash") {
        exec(
          `powershell.exe "./resources/PS1Scripts/GetRecycleBin.ps1"`,
          (_error: any, output: string) => {
            setDirectoryItems(formatTrash(output));
            setLoading(false);
          }
        );
      } else if (drive && currentDirectory) {
        document.title = currentDirectory || "";
        let result = [];
        try {
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

          setDirectoryItems(result);
          sortDirectoryItems(setDirectoryItems, "name", true);
        } catch (e) {
          if (currentDirectory) {
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
          }
        }
        setLoading(false);
      } else {
        exec(
          `wmic LogicalDisk where(DriveType=3) get Name,Size,VolumeName, FreeSpace, FileSystem`,
          (_, data: string) => {
            setDirectoryItems(formatDriveOutput(data));
            setLoading(false);
          }
        );
      }
    }
    setDirectoryItems([]);
    setLoading(true);
    updatePage();
    // eslint-disable-next-line
  }, [currentDirectory, reload, drive]);

  useEffect(() => {
    document.body.className = views.appTheme;
  }, [views.appTheme]);

  const renderDirectoryItems = directoryItems.map(
    (directoryItem, indexOfDirectoryItem) => {
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
          indexOfDirectoryItem={indexOfDirectoryItem}
        />
      );
    }
  );

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
        views,
        setViews,
      }}
    >
      <Navbar setPopup={setPopup} drag={drag} />
      <DirectoryTree />
      <Page
        selectedItems={[selectedItems, setSelectedItems]}
        clipboard={clipboard}
        reload={reload}
        loading={loading}
        setLastSelected={setLastSelected}
      >
        {pageView === "details" && (
          <DetailsView
            detailsTabWidth={detailsTabWidth}
            viewTypes={[
              "Name",
              "Modified",
              "Type",
              "Size",
              "Dimensions",
              "Duration",
              "Description",
            ]}
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
      <Title title={title} setTitle={setTitle} />
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
    </GeneralContext.Provider>
  );
}
