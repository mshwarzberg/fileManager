import GetVideoAtPercentage from "./GetVideoAtPercentage";

const child = window.require("child_process");

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
