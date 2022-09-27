const fs = window.require("fs");
export default function checkDestinationDuplicates(sourceItems, destination) {
  const destinationItems = fs.readdirSync(destination);
  const duplicates = [];
  for (const item of sourceItems) {
    if (destinationItems.includes(item)) {
      duplicates.push(item);
    }
  }
  return duplicates;
}
