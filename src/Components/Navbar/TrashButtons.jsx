import { useContext } from "react";
import { GeneralContext } from "../Main/Main";

export default function TrashButtons({ setPopup }) {
  const {
    views: { appTheme },
  } = useContext(GeneralContext);

  return (
    <>
      <button className={`button-${appTheme}`} onClick={() => {}}>
        Restore All
      </button>
      <button className={`button-${appTheme}`} onClick={() => {}}>
        Empty Trash
      </button>
    </>
  );
}
