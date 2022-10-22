import { useContext } from "react";
import { GeneralContext } from "../../Main/App";

import SettingsBody from "./SettingsBody";

export default function Settings({ setPopup }) {
  const {
    settings: { appTheme },
  } = useContext(GeneralContext);

  return (
    <button
      id="settings-button"
      className={`button-${appTheme}`}
      onClick={() => {
        setPopup({
          body: <SettingsBody setPopup={setPopup} />,
          ok: (
            <button id="ok-settings" className={`button-${appTheme}`}>
              OK
            </button>
          ),
          thirdButton: (
            <button
              id="apply-settings"
              disabled={true}
              className={`button-${appTheme}`}
            >
              Apply
            </button>
          ),
          cancel: (
            <button
              className={`button-${appTheme}`}
              onClick={() => {
                setPopup({});
              }}
            >
              Cancel
            </button>
          ),
          popupLabel: <h1 id="popup-label">Settings</h1>,
        });
      }}
    >
      Settings
    </button>
  );
}
