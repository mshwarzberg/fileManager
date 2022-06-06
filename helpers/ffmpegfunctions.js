const { formatDuration } = require("./formatvideoduration");
const child = require("child_process");

function ffmpegThumbs(name, outputfile, callback) {
  try {
    const getDuration = `ffprobe -show_streams -print_format json "${name}"`;
    let output = child.execSync(getDuration, { stdio: "pipe" }).toString();
    output = JSON.parse(output);
    let duration = output["streams"][0].duration * 1;
    const createThumbs = `ffmpeg -ss ${formatDuration(
      duration,
      77
    )} -i "${name}" -vf "scale=400:-2" -vframes 1 "${outputfile}"`;
    child.execSync(createThumbs, { stdio: "ignore" });
  } catch (e) {
    console.log(e);
    return;
  }
  callback();
}

function ffprobeMetadata(name, callback) {
  const probeCommand = `ffprobe -show_streams -print_format json "${name}"`;
  try {
    let output = child.execSync(probeCommand, { stdio: "pipe" }).toString();
    output = JSON.parse(output);
    callback({
      width: output["streams"][0].width || "",
      height: output["streams"][0].height || "",
      duration: output["streams"][0].duration,
    });
  } catch (e) {
    console.log(e);
  }
}
module.exports = { ffmpegThumbs, ffprobeMetadata };
