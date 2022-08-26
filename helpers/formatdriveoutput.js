const child = require("child_process");

function formatdriveoutput() {
  return new Promise((resolve, reject) => {
    let output = child.execSync(
      "wmic logicaldisk get caption,drivetype, size, freespace, volumename /format:Textvaluelist"
    );
    const sortedDrives = [];
    output = output.toString().split("\n");
    for (const i in output) {
      if (output[i].startsWith("Caption")) {
        sortedDrives.push({
          name: `${
            output[i * 1 + 4].split("\r\r")[0].split("=")[1] || "Local Disk"
          } (${output[i].split("=")[1].split("\r\r")[0]})`,
          isNetworkDrive: parseInt(output[i * 1 + 1].split("=")[1]) === 4,
          totalSize: parseInt(output[i * 1 + 3].split("=")[1]),
          availableSpace: parseInt(output[i * 1 + 2].split("=")[1]),
          permission: true,
          isDrive: true,
          path: output[i].split("=")[1].split("\r\r")[0] + "/",
        });
      }
    }
    resolve(sortedDrives);
  });
}

module.exports = { formatdriveoutput };
