import { useContext } from "react";
import { GeneralContext } from "../Main/Main.jsx";

const { exec } = window.require("child_process");

export default function Archive({
  contextMenu,
  subMenuClassNames,
  selectedItems,
}) {
  const {
    info: { filetype, path, fileextension },
  } = contextMenu;

  const {
    state: { currentDirectory },
  } = useContext(GeneralContext);

  const sevenZipPath = ".\\resources\\7zip\\7za.exe";

  return (
    <div className={subMenuClassNames()}>
      <button
        onClick={() => {
          exec(
            `${sevenZipPath} a "${
              currentDirectory +
              currentDirectory.slice(
                currentDirectory.lastIndexOf("/"),
                Infinity
              )
            }.zip" "${selectedItems.join('" "')}"`,
            (e, d) => {
              if (e) return console.log(e);
              console.log(d);
            }
          );
        }}
      >
        Add To Archive
      </button>
      {filetype === "archive" && (
        <button
          onMouseUp={() => {
            exec(
              `${sevenZipPath} x "${path}" -y -o"${path.slice(
                0,
                path.length - (fileextension?.length || 0)
              )}"`,
              (e, d) => {
                console.log(e, d);
              }
            );
          }}
        >
          Extract Here
        </button>
      )}
    </div>
  );
}
