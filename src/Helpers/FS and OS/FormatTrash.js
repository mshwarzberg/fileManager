import { itemData } from "./FormatMetadata";

const path = window.require("path");

export default function formatTrash(output) {
  output = output
    ?.replaceAll("\\\\", "/")
    .replaceAll("\\r\\n", "")
    .replaceAll("//", "/");
  output = JSON.parse(output || "[]").map((data) => JSON.parse(data));

  output = output.map((item) => {
    return {
      ...item,
      ...itemData(
        {
          ...item,
          isFile: () => {
            return !item.isDirectory;
          },
        },
        item.path,
        item.name
      ),
    };
  });
  console.log(output);
  return output;
}
