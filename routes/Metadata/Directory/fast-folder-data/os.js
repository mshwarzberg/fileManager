const path = require("path");

const commands = {
  // windows
  win32: `"${path.join(
    __dirname,
    "bin",
    "du.exe"
  )}" -nobanner -accepteula -q -c .`,

  // macos
  darwin: `du -sk .`,

  // any linux
  linux: `du -sb .`,
};

const processOutput = {
  // windows
  win32(stdout) {
    // query stats indexes from the end since path can contain commas as well
    const stats = stdout.split("\n")[1].split(",");

    const bytes = stats[5];
    const filecount = stats[3];
    const foldercount = stats[4];
    return {
      bytes: bytes * 1,
      filecount: filecount * 1,
      foldercount: foldercount - 1,
    };
  },

  // macos
  darwin(stdout) {
    const match = /^(\d+)/.exec(stdout);

    const bytes = Number(match[1]) * 1024;

    return bytes;
  },

  // any linux
  linux(stdout) {
    const match = /^(\d+)/.exec(stdout);

    const bytes = Number(match[1]);

    return bytes;
  },
};

module.exports = { commands, processOutput };
