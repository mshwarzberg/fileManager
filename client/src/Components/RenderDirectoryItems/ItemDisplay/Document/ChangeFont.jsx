import React, { useState, useEffect, useContext } from "react";
import FontStyles from "./FontStyles";
import { listOfFonts, fontSizes } from "./listOfFonts";
import { DocumentContext } from "./DocumentDisplay";

export default function ChangeFont() {
  const [showFonts, setShowFonts] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const { font, setFont } = useContext(DocumentContext);

  useEffect(() => {
    setShowFonts(false);
    setShowFontSize(false);
  }, [font]);

  const renderFontChoices = listOfFonts.map((font) => {
    return (
      <li
        key={font}
        style={{ fontFamily: font }}
        onClick={(e) => {
          setFont((prevFont) => ({
            ...prevFont,
            family: font,
          }));
          e.stopPropagation();
        }}
      >
        {font}
      </li>
    );
  });
  const renderFontSizes = fontSizes.map((size) => {
    return (
      <li
        key={size}
        onClick={(e) => {
          setFont((prevFont) => ({
            ...prevFont,
            size: size,
          }));
          e.stopPropagation();
        }}
      >
        {size} px
      </li>
    );
  });

  return (
    <div id="font-styling-container">
      <button
        onClick={(e) => {
          if (e.target.tagName === "BUTTON") {
            setShowFonts(!showFonts);
          }
        }}
        style={{ fontFamily: font.family }}
      >
        Choose Font Family
        {showFonts && (
          <ol
            className="fonts-list"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {renderFontChoices}
          </ol>
        )}
      </button>
      <button
        onClick={() => {
          setShowFontSize(!showFontSize);
        }}
      >
        Change font size
        {showFontSize && <ol className="fonts-list">{renderFontSizes}</ol>}
      </button>
      <FontStyles
        setFont={setFont}
        changedStyle={"bold"}
        font={font}
        letter={"B"}
        customStyle={{ fontWeight: "bold" }}
      />
      <FontStyles
        setFont={setFont}
        changedStyle={"italic"}
        font={font}
        letter={"I"}
        customStyle={{ fontStyle: "italic" }}
      />
      <FontStyles
        setFont={setFont}
        changedStyle={"underline"}
        font={font}
        letter={"U"}
        customStyle={{ textDecoration: "underline" }}
      />
      <FontStyles
        setFont={setFont}
        changedStyle={"strikethrough"}
        font={font}
        letter={"S"}
        customStyle={{ textDecoration: "line-through" }}
      />
    </div>
  );
}
