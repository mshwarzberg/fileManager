import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { UIContext } from "../GeneralUI";

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
          fetch("/api/directorytree/initialtree")
            .then(async (res) => {
              const response = await res.json();
              dispatch({
                type: "updateDirectoryTree",
                value: [
                  { collapsed: false, permission: true, isRoot: true },
                  ...response,
                ],
              });
            })
            .catch((e) => {});
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
