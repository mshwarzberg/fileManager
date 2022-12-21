const { exec } = window.require("child_process");
export default function Archive({ contextMenu, subMenuClassNames }) {
  const {
    info: { filetype, path, fileextension },
  } = contextMenu;
  return (
    <div className={subMenuClassNames()}>
      <button>Add To Archive</button>
      {filetype === "archive" && (
        <button
          onMouseUp={() => {
            exec(
              `.\\resources\\7zip\\7za.exe x "${path}" -y -o"${path.slice(
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
