import { useEffect, useState } from "react";
import formatSize from "../../Helpers/FormatSize";

const { exec } = window.require("child_process");

let titleTimeout;
export default function CustomTitle() {
  const [element, setElement] = useState();
  const [title, setTitle] = useState({});

  useEffect(() => {
    if (title.title) {
      const titleDimensions = document
        .getElementById("custom-title")
        .getBoundingClientRect();
      let newDimensions = {
        x: title.x,
        y: title.y,
      };
      if (titleDimensions.width + titleDimensions.left > window.innerWidth) {
        newDimensions.x = title.x - titleDimensions.width;
      }
      if (titleDimensions.height + titleDimensions.top > window.innerHeight) {
        newDimensions.y = title.y - titleDimensions.height - 15;
      }
      setTitle((prevTitle) => ({
        ...prevTitle,
        ...newDimensions,
      }));
    }
    // eslint-disable-next-line
  }, [title.title]);

  useEffect(() => {
    let process;
    function titleEvent(e) {
      clearTimeout(titleTimeout);
      if (Object.entries(title)) {
        setTitle({});
      }
      if (e.target.dataset?.title) {
        setElement(e.target);
        titleTimeout = setTimeout(() => {
          if (
            e.target.dataset?.info &&
            JSON.parse(e.target.dataset.info).isDirectory
          ) {
            const directoryPath = JSON.parse(e.target.dataset.info).path + "/";
            const cmd = `powershell.exe ./PS1Scripts/DirectoryInfo.ps1 """${directoryPath}"""`;
            function formatDirectoryTitleInfo(result) {
              const { files, directories, hidden, combined, size } = result;
              if (combined === 0) {
                return "\nCount: 0 (Folder is empty)";
              }
              return `\nCount: ${combined} (${files ? files + " files" : ""}${
                directories ? ", " + directories + " directories" : ""
              }${hidden ? ", " + hidden + " hidden items" : ""})\n${
                size?.Sum ? `Size: ${formatSize(size.Sum)}` : ""
              }`;
            }
            try {
              process = exec(cmd, (err, result) => {
                if (err) return;
                setTitle({
                  title: `${e.target.dataset.title}${formatDirectoryTitleInfo(
                    JSON.parse(result.replace("\\r\\n", ""))
                  )}`,
                  x: e.clientX,
                  y: e.clientY + 3,
                });
              });
            } catch (e) {}
          } else {
            setTitle({
              title: e.target.dataset.title,
              x: e.clientX,
              y: e.clientY + 3,
            });
          }
        }, e.target.dataset.timing || 800);
      }
    }

    element?.addEventListener("mouseleave", () => {
      clearTimeout(titleTimeout);
    });
    function clearTitle() {
      setTitle({});
    }
    document.addEventListener("mousemove", titleEvent);
    document.addEventListener("mousedown", clearTitle);
    document.addEventListener("wheel", clearTitle);
    return () => {
      process?.kill("SIGINT");
      element?.removeEventListener("mouseleave", () => {
        clearTimeout(titleTimeout);
      });
      document.removeEventListener("mousemove", titleEvent);
      document.removeEventListener("wheel", clearTitle);
      document.removeEventListener("mousedown", clearTitle);
    };
    // eslint-disable-next-line
  }, [element]);

  return (
    (title.x || title.y) && (
      <pre
        style={{
          top: title.y,
          left: title.x,
          ...(title.style && JSON.parse(title.style)),
        }}
        id="custom-title"
      >
        {title.title}
      </pre>
    )
  );
}
