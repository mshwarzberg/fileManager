import React from "react";

export default function FontStyles({
  font,
  setFont,
  changedStyle,
  letter,
  customStyle,
}) {
  return (
    <button
      style={{
        outline: font[changedStyle] ? "1px solid #4444ff87" : "",
        backgroundColor: font[changedStyle] ? "#acacff77" : "",
        ...customStyle,
      }}
      onClick={() => {
        setFont((prevFont) => ({
          ...prevFont,
          [changedStyle]: !prevFont[changedStyle],
        }));
      }}
    >
      {letter}
    </button>
  );
}
