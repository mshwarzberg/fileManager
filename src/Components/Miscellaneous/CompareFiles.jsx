import { useContext, useEffect, useState } from "react";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import { GeneralContext } from "../Main/App.jsx";
import BlockComparison from "./BlockComparison";

const fs = window.require("fs");

export default function CompareFiles({ duplicates, source, destination }) {
  const {
    state: { drive },
  } = useContext(GeneralContext);

  function getItemMetadata(location) {
    let result = fs
      .readdirSync(location, { withFileTypes: true })
      .map((item) => {
        return formatMetadata(item, location, drive);
      })
      .filter((item) => duplicates.includes(item.name) && item)
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    return result;
  }

  const [checked, setChecked] = useState({
    [source]: [],
    [destination]: [],
  });

  function handleChecked(location) {
    const inputs = document.getElementsByClassName(location);
    for (const input of inputs) {
      if (
        checked[location].includes(input.id.slice(location.length, Infinity))
      ) {
        input.checked = true;
      }
    }
  }
  useEffect(() => {
    handleChecked(source);
  }, [checked[source]]);

  useEffect(() => {
    handleChecked(destination);
  }, [checked[destination]]);

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
            setChecked={setChecked}
          />
          <div className="vertical-separator" />
          <BlockComparison
            key={destinationItem.key}
            directoryItem={destinationItem}
            location={destination}
            setChecked={setChecked}
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
          <input type="checkbox" id="select-all-in-source" />
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
          <input type="checkbox" id="select-all-in-destination" />
        </div>
      </div>
      <div id="file-comparison">{renderDuplicates()}</div>
    </div>
  );
}
