import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";

export default function Prompt() {
  const { popups, setPopups } = useContext(GeneralContext);

  return (
    <div id="prompt-body" onClick={() => {}}>
      Prompt
    </div>
  );
}
