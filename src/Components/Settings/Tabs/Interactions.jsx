import React from "react";

export default function Interactions({
  handleChange,
  clickToOpen,
  appliedAppTheme,
}) {
  return (
    <div
      onChange={(e) => {
        handleChange(e, "settings");
      }}
      className="settings-block"
    >
      <h2 className={`text-${appliedAppTheme}`}>Opening Files and Folders</h2>
      <label className={`text-${appliedAppTheme}`}>
        <input
          type="radio"
          value="single"
          name="clickToOpen"
          checked={clickToOpen === "single"}
          readOnly
        />
        Single Click To Open
      </label>
      <label className={`text-${appliedAppTheme}`}>
        <input
          type="radio"
          value="double"
          name="clickToOpen"
          checked={clickToOpen === "double"}
          readOnly
        />
        Double Click To Open
      </label>
      <div className="horizontal-separator" />
    </div>
  );
}
