import { useContext } from "react";
import sortBy from "../../Helpers/Sort";
import { GeneralContext } from "../Main/App.jsx";

export default function Sort({ contextMenu }) {
  const sortOptions = ["Name", "Size", "Date", "Type", "Duration"];
  const { setDirectoryItems } = useContext(GeneralContext);

  function subMenuClassNames() {
    let className = "sort-by-sub-menu";
    if (contextMenu.x + 320 > window.innerWidth) {
      className += " position-left";
    }
    if (contextMenu.y + 238 > window.innerHeight) {
      className += " position-top";
    }
    return className;
  }
  return (
    <div className={subMenuClassNames()}>
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
            ...{method}
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
