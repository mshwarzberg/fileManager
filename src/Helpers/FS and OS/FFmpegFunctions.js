import checkFileType from "./CheckFileType";
import GetVideoAtPercentage from "./GetVideoAtPercentage";

const child = window.require("child_process");
const exifr = window.require("exifr");

export function ffmpegThumbs(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    try {
      let output = child.execFileSync("ffprobe.exe", [
        "-show_format",
        "-print_format",
        "json",
        inputFile,
      ]);
      output = JSON.parse(output || "{}");
      let duration = output["format"].duration * 1;
      child.execFileSync("ffmpeg.exe", [
        "-ss",
        GetVideoAtPercentage(duration),
        "-i",
        inputFile,
        "-vf",
        "scale=400:-2",
        "-vframes",
        "1",
        "-y",
        outputFile,
      ]);
    } catch (e) {
      console.error(e);
    }
    resolve();
  });
}

export function ffprobeMetadata(name) {
  const probeCommand = `ffprobe.exe -show_streams -show_format -print_format json "${name}"`;

  return new Promise(async (resolve, reject) => {
    try {
      let output = child.execSync(probeCommand).toString();
      output = JSON.parse(output || "{}");
      let dimensions = output["streams"][0];
      await exifr
        .parse(name, true)
        .then((data) => {
          resolve({
            width: dimensions.width,
            height: dimensions.height,
            duration:
              parseInt(output["format"].duration) >= 1
                ? output["format"].duration
                : null,
            ...(data?.description && {
              description: data.description.value || data.description,
            }),
          });
        })
        .catch(() => {
          resolve({
            width: dimensions.width,
            height: dimensions.height,
            duration:
              parseInt(output["format"].duration) >= 1
                ? output["format"].duration
                : null,
          });
        });
    } catch (e) {
      resolve({
        width: "",
        height: "",
        duration: "",
      });
    }
  });
}
