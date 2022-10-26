import { useContext, useEffect, useState } from "react";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import { GeneralContext } from "../Main/App.jsx";
import BlockComparison from "./BlockComparison";

const fs = window.require("fs");

export default function CompareFiles({
  duplicates,
  source,
  destination,
  copyItems,
  mode,
  moveItems,
  setPopup,
}) {
  const {
    state: { drive },
  } = useContext(GeneralContext);

  function getItemMetadata(location) {
    let result = fs
      .readdirSync(location, { withFileTypes: true })
      .map((item) => {
        return formatMetadata(item, location, drive);
      })
      .filter(
        (item) =>
          duplicates.map((item) => item.name).includes(item.name) && item
      )
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    return result;
  }

  const [checked, setChecked] = useState({
    [source]: [],
    [destination]: [],
  });

  useEffect(() => {
    const temp = [];
    let x = 0;
    for (const name of checked[source]) {
      x++;
      const [prefix, fileextension] = name.split("\\:");
      if (checked[destination].includes(name)) {
        x--;
        temp.push(prefix + " (1)" + fileextension);
      } else {
        temp.push(prefix + fileextension);
      }
    }
    x += checked[destination].length;

    if (x === duplicates.length) {
      document.getElementById("confirm-selections").disabled = false;
    } else {
      document.getElementById("confirm-selections").disabled = true;
    }
    function submitTransfers() {
      duplicates.map((duplicate, i) => {
        const { isFile } = duplicate;
        if (mode === "copy") {
          copyItems(duplicate.source, destination + temp[i], isFile);
        } else {
          moveItems(duplicate.source, destination + temp[i]);
        }
        setPopup({});
      });
    }
    document
      .getElementById("confirm-selections")
      .addEventListener("click", submitTransfers);
    return () => {
      document
        .getElementById("confirm-selections")
        ?.removeEventListener("click", submitTransfers);
    };
  }, [checked]);

  function handleChecked(i, arr) {
    if (checked[arr].includes(i)) {
      checked[arr].splice(checked[arr].indexOf(i), 1);
      setChecked({
        [source]: checked[source],
        [destination]: checked[destination],
      });
    } else {
      setChecked((prevObj) => ({
        ...prevObj,
        [arr]: [...prevObj[arr], i],
      }));
    }
  }

  function selectAllOrNone(arr) {
    if (checked[arr].length === duplicates.length) {
      checked[arr] = [];
    } else {
      checked[arr] = [
        ...duplicates.map((item) => item.prefix + "\\:" + item.fileextension),
      ];
    }
    setChecked({
      [source]: checked[source],
      [destination]: checked[destination],
    });
  }

  function renderDuplicates() {
    const sourceItems = getItemMetadata(source);
    const destinationItems = getItemMetadata(destination);

    return sourceItems.map((sourceItem) => {
      let destinationItem;
      for (destinationItem of destinationItems) {
        if (destinationItem.name === sourceItem.name) {
          break;
        }
      }

      return (
        <div className="comparison" key={sourceItem.name}>
          <BlockComparison
            key={sourceItem.key}
            directoryItem={sourceItem}
            location={source}
            checked={checked}
            handleChecked={handleChecked}
          />
          <div className="vertical-separator" />
          <BlockComparison
            key={destinationItem.key}
            directoryItem={destinationItem}
            location={destination}
            checked={checked}
            handleChecked={handleChecked}
          />
          <div className="horizontal-separator" />
          <p className="name">{sourceItem.name}</p>
        </div>
      );
    });
  }

  return (
    <div id="file-comparison-body">
      <h1 id="description">
        Which item would you like to keep?
        <br />
        (selecting both will add " - Copy" to the end of the incoming item's
        name)
        <br />
      </h1>
      <div id="select-all">
        <div>
          <input
            type="checkbox"
            id="select-all-in-source"
            checked={duplicates.length === checked[source].length}
            onChange={() => {
              selectAllOrNone(source);
            }}
          />
          <label htmlFor="select-all-in-source">
            Select All In&nbsp;
            <b data-title={source} data-timing={0}>
              Source
            </b>
          </label>
        </div>
        <div>
          <label htmlFor="select-all-in-destination">
            Select All In&nbsp;
            <b data-title={destination} data-timing={0}>
              Destination
            </b>
          </label>
          <input
            type="checkbox"
            id="select-all-in-destination"
            checked={duplicates.length === checked[destination].length}
            onChange={() => {
              selectAllOrNone(destination);
            }}
          />
        </div>
      </div>
      <div id="file-comparison">{renderDuplicates()}</div>
    </div>
  );
}
