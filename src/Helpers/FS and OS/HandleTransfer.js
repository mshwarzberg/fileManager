import CompareFiles from "../../Components/Miscellaneous/CompareFiles";

import {
  transfer,
  copyItems,
  moveItems,
  checkForDuplicates,
} from "./TransferFunctions";

const fs = window.require("fs");
const { exec } = window.require("child_process");

export function handleTransfer(destination, setPopup, data, setClipboard) {
  const { source, mode, info } = data;

  if (source === destination) {
    if (mode === "cut") {
      setClipboard({});
      return;
    }
    for (const { fileextension, location, prefix } of info) {
      copyToSameDirectory(prefix, fileextension, location);
    }
  } else {
    const duplicates = checkForDuplicates(
      destination,
      source,
      info.map((item) => item.name)
    );
    if (duplicates[0]) {
      setPopup({
        body: (
          <div id="body">
            <h1 id="description">
              There {duplicates.length > 1 ? "are" : "is"} {duplicates.length}
              &nbsp;duplicate item{duplicates.length > 1 && "s"} in the
              destination
            </h1>
          </div>
        ),
        ok: (
          <button
            onClick={() => {
              for (const { name, isFile, location } of info) {
                transfer(location, name, destination, isFile);
              }
              setPopup({});
            }}
          >
            Replace All
          </button>
        ),
        cancel: (
          <button
            onClick={() => {
              const duplicateNames = duplicates.map((item) => item.name);

              for (const { location, prefix, fileextension, isFile } of info) {
                let name;
                if (duplicateNames.includes(prefix + fileextension)) {
                  name = newName(location, prefix, fileextension);
                } else {
                  name = prefix + fileextension;
                }
                if (mode === "copy") {
                  copyItems(
                    source + prefix + fileextension,
                    destination + name,
                    isFile
                  );
                } else {
                  moveItems(
                    source + prefix + fileextension,
                    destination + name
                  );
                }
              }
              setPopup({});
            }}
          >
            Keep All
          </button>
        ),
        thirdButton: (
          <button
            onClick={() => {
              setPopup((prevPopup) => {
                return {
                  body: (
                    <CompareFiles
                      duplicates={duplicates}
                      source={source}
                      destination={destination}
                      mode={mode}
                      setPopup={setPopup}
                    />
                  ),
                  ok: (
                    <button id="confirm-selections" disabled={true}>
                      Confirm Selections
                    </button>
                  ),
                  cancel: (
                    <button
                      onClick={() => {
                        setPopup(prevPopup);
                      }}
                    >
                      Go Back
                    </button>
                  ),
                  popupLabel: <h1 id="popup-label">Compare Items</h1>,
                };
              });
            }}
          >
            Compare Items
          </button>
        ),
      });
      return;
    }
    for (const { path, location, isFile, name } of info) {
      transfer(isFile ? location : path, destination, name, isFile, mode);
    }
  }
}

function copyToSameDirectory(prefix, fileextension, location) {
  const path = location + prefix + fileextension;
  function generateNameForCopiedItem() {
    while (true) {
      try {
        fs.accessSync(location + prefix + fileextension);
      } catch {
        return location + prefix + fileextension;
      }
      prefix += " - Copy";
    }
  }

  const newPath = generateNameForCopiedItem();

  const command = `powershell.exe copy-item '${path.replaceAll(
    "'",
    "''"
  )}' '${newPath.replaceAll("'", "''")}' -recurse`;

  try {
    exec(command, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
}

function newName(directory, prefix, fileextension) {
  let i = 1;
  while (true) {
    const newFileName = `${prefix}${i > 1 ? ` (${i})` : ""}${fileextension}`;
    try {
      fs.accessSync(directory + newFileName);
    } catch (e) {
      console.log(e);
      return newFileName;
    }
    i++;
  }
}
