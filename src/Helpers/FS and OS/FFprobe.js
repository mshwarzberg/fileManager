const { execSync } = window.require("child_process");
const exifr = window.require("exifr");

export default function FFprobe(path, filetype, setState) {
  const probeCommand = `ffprobe.exe -show_streams -print_format json "${path}"`;
  let output;
  try {
    output = execSync(probeCommand).toString();
  } catch {
    return;
  }
  output = JSON.parse(output || "{}");
  const dimensions = output["streams"][0];
  setState({
    width: dimensions.width,
    height: dimensions.height,
    duration: dimensions.duration > 1 && dimensions.duration,
  });
  if (filetype === "image") {
    exifr
      .parse(path, true)
      .then((data) => {
        if (!data) {
          return;
        }
        const description =
          data.Comment || data.description?.value || data.description;
        setState((prevData) => ({
          ...prevData,
          description: description,
        }));
      })
      .catch(() => {});
  }
}
