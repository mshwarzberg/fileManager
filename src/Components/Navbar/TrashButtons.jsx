import { useContext } from "react";
import { GeneralContext } from "../Main/Main";

export default function TrashButtons({
  setPopup,
  directoryContent,
  setDirectoryContent,
}) {
  const {
    views: { appTheme },
  } = useContext(GeneralContext);

  return (
    <>
      <button
        className={`button-${appTheme}`}
        onClick={() => {}}
        disabled={directoryContent.length === 0}
      >
        Restore All
      </button>
      <button
        className={`button-${appTheme}`}
        onClick={() => {}}
        disabled={directoryContent.length === 0}
      >
        Empty Trash
      </button>
    </>
  );
}
