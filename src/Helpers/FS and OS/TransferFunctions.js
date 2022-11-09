import formatMetadata from "./FormatMetadata";

const fs = window.require("fs");
const { exec } = window.require("child_process");

function transfer(source, destination, mode) {
  exec(
    `powershell.exe ./PS1Scripts/Transfer.ps1 '${source}' '${destination}' ${mode}`
  );
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

export { transfer, checkForDuplicates };
