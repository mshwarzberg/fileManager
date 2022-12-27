import { useContext } from "react";
import { GeneralContext } from "../../Main/Main";

export default function ArchivePopup() {
  const {
    views: { appTheme },
  } = useContext(GeneralContext);
  return (
    <div id="archive-body">
      <label>
        Input Path
        <input type="text" />
      </label>
    </div>
  );
}
