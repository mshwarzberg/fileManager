import React, { useContext } from "react";
import sortBy from "../../Helpers/SortBy";
import { DirectoryContext } from "../Main/App";

export default function Sort({ contextMenu }) {
  const sortOptions = ["Name", "Size", "Date", "Type"];
  const { setDirectoryItems } = useContext(DirectoryContext);

  return (
    <div
      className={`sort-by-sub-menu ${
        contextMenu.x + 320 > window.innerWidth ? "position-left" : ""
      }`}
    >
      {sortOptions.map((method) => {
        return (
          <button
            key={method}
            onClick={() => {
              sortBy(
                setDirectoryItems,
                method,
                sessionStorage.getItem("ascending")
              );
              sessionStorage.setItem("method", method);
            }}
          >
            {method}
          </button>
        );
      })}
      <div id="line-break" />
      <button
        onClick={() => {
          sessionStorage.setItem("ascending", true);
          sortBy(
            setDirectoryItems,
            sessionStorage.getItem("method") || "Name",
            true
          );
        }}
      >
        {sessionStorage.getItem("ascending") && <div id="dot" />} Ascending
      </button>
      <button
        onClick={() => {
          sessionStorage.removeItem("ascending");
          sortBy(
            setDirectoryItems,
            sessionStorage.getItem("method") || "Name",
            false
          );
        }}
      >
        {!sessionStorage.getItem("ascending") && <div id="dot" />} Descending
      </button>
    </div>
  );
}
