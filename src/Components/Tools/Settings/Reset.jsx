import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { UIContext } from "../GeneralUI";
import initialDirectoryTree from "../../Main/FS and OS/InitialDirectoryTree";

export default function Reset() {
  const { dispatch } = useContext(GeneralContext);
  const { setPopup } = useContext(UIContext);
  return (
    <div id="reset-settings">
      <h2>
        Reset Options
        <div id="underline" />
      </h2>
      <button
        onClick={() => {
          initialDirectoryTree().then((result) => {
            dispatch({
              type: "updateDirectoryTree",
              value: [
                { collapsed: false, permission: true, isRoot: true },
                ...result,
              ],
            });
          });
        }}
      >
        Reset Folder Tree
      </button>
      <button
        onClick={() => {
          localStorage.removeItem("state");
          dispatch({
            type: "resetToDefault",
          });
          setPopup({
            type: "confirm",
            dialog: "Do you want to reload the page?",
            confirmFunction: () => {
              window.location.reload(true);
            },
          });
        }}
      >
        Clear History
      </button>
    </div>
  );
}
