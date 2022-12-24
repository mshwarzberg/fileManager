import { useEffect, useState, useContext } from "react";
import formatSize from "../../Helpers/FormatSize";
import { GeneralContext } from "../Main/Main.tsx";

const { exec } = window.require("child_process");

let titleTimeout;
export default function Title() {
  const {
    views: { appTheme },
    state: { currentDirectory },
  } = useContext(GeneralContext);

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
            const cmd = `powershell.exe "./resources/PS1Scripts/DirectoryInfo.ps1" """${directoryPath}"""`;
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
        }, 800);
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

  useEffect(() => {
    const element = document.querySelector("#custom-title");
    if (element) {
      const { y, x, width, height } = element.getBoundingClientRect();
      setTitle((prevState) => ({
        ...prevState,
        x: x + width > window.innerWidth ? x - width : prevState.x,
        y: y + height > window.innerHeight ? y - height - 30 : prevState.y,
        visible: true,
      }));
    }
    // eslint-disable-next-line
  }, [title.title]);

  useEffect(() => {
    setTitle({});
  }, [currentDirectory]);

  return (
    <pre
      style={{
        top: title.y + "px",
        left: title.x + "px",
        ...(title.style && JSON.parse(title.style)),
        visibility: !title.title && title.visible ? "hidden" : "",
      }}
      className={`title-${appTheme} ${
        !title.visible ? "fitting-title-to-page" : ""
      }`}
      id="custom-title"
    >
      {title.title}
    </pre>
  );
}
