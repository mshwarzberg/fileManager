const { formatDuration } = require("./formatvideoduration");
const child = require("child_process");
var exifr = require("exifr");

function ffmpegThumbs(name, outputfile, callback) {
  try {
    const getDuration = `ffprobe.exe -show_format -print_format json "${name}"`;
    let output = child.execSync(getDuration, { stdio: "pipe" }).toString();
    output = JSON.parse(output);
    let duration = output["format"].duration * 1;
    const createThumbs = `ffmpeg.exe -ss ${formatDuration(
      duration,
      82
    )} -i "${name}" -vf "scale=400:-2" -vframes 1 "${outputfile}"`;
    child.exec(createThumbs, { stdio: "ignore" });
    callback();
  } catch (e) {
    callback();
  }
}

function ffprobeMetadata(name, callback) {
  const probeCommand = `ffprobe.exe -show_streams -show_format -print_format json "${name}"`;

  try {
    let output = child.execSync(probeCommand, { stdio: "pipe" }).toString();
    exifr
      .parse(name, true)
      .then((data) => {
        output = JSON.parse(output);
        let dimensions = output["streams"][0];
        callback({
          width: dimensions.width,
          height: dimensions.height,
          duration: output["format"].duration,
          ...(data?.description && { description: data.description }),
        });
      })
      .catch(() => {
        output = JSON.parse(output);
        let dimensions = output["streams"][0];
        callback({
          width: dimensions.width,
          height: dimensions.height,
          duration: output["format"].duration,
        });
      });
  } catch (e) {
    callback({
      width: "",
      height: "",
      duration: "",
    });
  }
}

module.exports = {
  ffmpegThumbs,
  ffprobeMetadata,
};
