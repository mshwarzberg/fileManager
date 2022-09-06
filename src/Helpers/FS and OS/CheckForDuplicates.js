const fs = window.require("fs");

export default function checkForDuplicates(destination, names) {
  return new Promise((resolve, reject) => {
    const destinationFiles = fs.readdirSync(destination);
    const duplicates = names
      .map((name) => {
        if (destinationFiles.includes(name)) {
          return name;
        }
      })
      .filter((item) => item && item);

    return resolve(duplicates);
  });
}
