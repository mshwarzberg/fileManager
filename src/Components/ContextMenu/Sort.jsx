import { useContext } from "react";
import sortBy from "../../Helpers/Sort";
import { GeneralContext } from "../Main/Main.tsx";

export default function Sort({ subMenuClassNames }) {
  const sortOptions = ["Name", "Size", "Date", "Type", "Duration"];
  const { setDirectoryItems } = useContext(GeneralContext);

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
