const { formatDuration } = require("./formatvideoduration");
const child = require("child_process");
const { unlinkSync, existsSync } = require("fs");

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

function formatStreamDuration(time) {
  time = time.split(":");
  let totalTime = time[0] * 3600 + time[1] * 60 + time[2] * 1;
  return totalTime;
}

function ffprobeMetadata(name, callback) {
  const probeCommand = `ffprobe -show_streams -print_format json "${name}"`;
  let output;
  let alternateDuration;
  try {
    output = child.execSync(probeCommand, { stdio: "pipe" }).toString();
    output = JSON.parse(output);
    if (!output["streams"][0].duration) {
      alternateDuration = formatStreamDuration(
        output["streams"][0].tags["DURATION"]
      );
    }
  } catch (e) {}
  callback({
    width: output["streams"][0].width || "",
    height: output["streams"][0].height || "",
    duration: output["streams"][0].duration || alternateDuration || "",
  });
}

async function transcodeVideo(file, drive, callback) {
  // const video = `ffmpeg -y -i "${file}" -movflags +faststart -vf scale=-2:720,format=yuv420p "${drive}/thumbnails/temp/temp.mp4"`;
  // if (existsSync(`${drive}/thumbnails/temp/temp.mp4`)) {
  //   unlinkSync(`${drive}/thumbnails/temp/temp.mp4`);
  // }
  callback();
  // child.exec(video, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.error(`stderr: ${stderr}`);
  // });
}

function cancelTranscode() {
  const killffmpeg = "taskkill /IM ffmpeg.exe /F";
  try {
    child.execSync(killffmpeg, { stdio: "ignore" });
  } catch (e) {
    // console.log(e.stderr.toString());
  }
}

module.exports = {
  ffmpegThumbs,
  ffprobeMetadata,
  transcodeVideo,
  cancelTranscode,
};