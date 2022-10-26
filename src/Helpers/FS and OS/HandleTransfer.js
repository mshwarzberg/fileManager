import CompareFiles from "../../Components/Miscellaneous/CompareFiles";
import formatMetadata from "./GetMetadata";

const fs = window.require("fs");
const { exec } = window.require("child_process");

function copyItems(source, destination, isFile) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  if (isFile) {
    const copy = `copy ${formatName}`;
    try {
      exec(copy);
    } catch (error) {}
  } else {
    exec(`xcopy ${formatName}\\ /s /h /e`);
  }
}

function moveItems(source, destination) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  exec(`move ${formatName}`);
}

export function handleTransfer(destination, setPopup, clipboard, setClipboard) {
  const { source, mode, info } = clipboard;
  function transfer(sourcePath, destinationPath, name, isFile, mode) {
    let command = "";
    // use location for files and path for everything else
    if (!isFile) {
      command = `robocopy "${sourcePath}" "${destinationPath}/${name}" ${
        mode === "copy" ? "" : "/move"
      }`;
    } else {
      command = `robocopy "${sourcePath}" "${destinationPath}" "${name}" ${
        mode === "copy" ? "" : "/mov"
      }`;
    }

    try {
      exec(command, (err) => {
        if (err) console.log(err);
      });
    } catch (error) {}
  }

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
              for (const {
                source,
                prefix,
                fileextension,
                isFile,
              } of duplicates) {
                if (mode === "copy") {
                  copyItems(
                    source,
                    destination + prefix + " (1)" + fileextension,
                    isFile
                  );
                } else {
                  moveItems(
                    source,
                    destination + prefix + " (1)" + fileextension
                  );
                }
              }
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
                      copyItems={copyItems}
                      moveItems={moveItems}
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

function checkForDuplicates(destination, source, itemNames) {
  const duplicates = [];

  const result = fs.readdirSync(destination, { withFileTypes: true });
  for (const item of result) {
    const formatted = formatMetadata(
      item,
      destination,
      destination.slice(0, 3)
    );
    if (itemNames.includes(formatted.name)) {
      duplicates.push({ ...formatted, source: source + formatted.name });
    }
  }

  return duplicates;
}

function copyToSameDirectory(prefix, fileextension, location) {
  const path = location + prefix + fileextension;
  function generateNameForCopiedItem() {
    while (true) {
      try {
        fs.accessSync(location + prefix + fileextension);
      } catch (error) {
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
