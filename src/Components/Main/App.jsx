import { createContext, useEffect, useState } from "react";

import DirectoryState from "./State/DirectoryState";
import UIandUXState from "./State/UIandUXState";

import Page from "../DirectoryPage/Page";
import Navbar from "../Navbar/Navbar";
import DirectoryTree from "../DirectoryTree/DirectoryTree";
import FilesAndDirectories from "../DirectoryPage/FilesAndDirectories";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import UIandUX from "./UIandUX";
import sortBy from "../../Helpers/SortBy";

export const DirectoryContext = createContext();

const fs = window.require("fs");
const { execSync } = window.require("child_process");

export default function App() {
  const {
    state,
    state: { currentDirectory, drive },
    dispatch,
  } = DirectoryState();

  const { settings, setSettings } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState();
  const [visibleItems, setVisibleItems] = useState([]);
  const [popup, setPopup] = useState({});
  const [clipboard, setClipboard] = useState({});

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
            body: <div id="body">{e.toString()}</div>,
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
        const drives = await formatDriveOutput();
        setDirectoryItems(drives);
        if (state.directoryTree[0]) {
          for (const item of drives) {
            if (item.isNetworkDrive) {
              dispatch({
                type: "addNetworkDrive",
                value: item.path,
              });
            }
          }
        }
      }
    }
    updatePage();
    // eslint-disable-next-line
  }, [currentDirectory, drive]);

  useEffect(() => {
    if (!currentDirectory?.startsWith(drive) || !drive) {
      dispatch({
        type: "drive",
        value:
          currentDirectory === "Trash" ? drive : currentDirectory?.slice(0, 3),
      });
    }
  }, [currentDirectory]);

  const renderDirectoryItems = directoryItems.map((directoryItem) => {
    return (
      <FilesAndDirectories
        key={directoryItem.key || directoryItem.name}
        directoryItem={directoryItem}
        visibleItems={visibleItems}
        lastSelected={lastSelected}
        setLastSelected={setLastSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    );
  });
  return (
    <DirectoryContext.Provider
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
      <Navbar setPopup={setPopup} />
      <DirectoryTree />
      <Page
        setVisibleItems={setVisibleItems}
        selectedItems={selectedItems}
        clipboard={clipboard}
      >
        {renderDirectoryItems}
      </Page>
      <UIandUX
        setLastSelected={setLastSelected}
        lastSelected={lastSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        popup={popup}
        setPopup={setPopup}
        clipboard={clipboard}
        setClipboard={setClipboard}
      />
      {/* <button
        style={{ position: "fixed" }}
        onClick={() => {
          const array = [];
          directoryItems.map((item) => {
            if (item.fileextension === ".jpg") {
              array.push(`"${item.path.replaceAll("/", "\\")}"`);
            }
          });
          console.log(`copy /b ${array.join("+")} B:\\x.jpg`);
          // execSync();
        }}
      >
        Test Button
      </button> */}
    </DirectoryContext.Provider>
  );
}
