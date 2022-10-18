import { useContext, useState, useEffect } from "react";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import { DirectoryContext } from "../Main/App.jsx";
import BlockComparison from "./BlockComparison";

const fs = window.require("fs");

export default function CompareFiles({ duplicates, source, destination }) {
  const {
    state: { drive },
  } = useContext(DirectoryContext);

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
          <BlockComparison key={sourceItem.key} directoryItem={sourceItem} />
          <div className="vertical-separator" />
          <BlockComparison
            key={destinationItem.key}
            directoryItem={destinationItem}
          />
          <div className="horizontal-separator" />
          <p className="name">{sourceItem.name}</p>
        </div>
      );
    });
  }

  return (
    <div id="body">
      <h1 id="description">
        Which item would you like to keep?
        <br />
        (selecting both will have a new number added to the end of the name)
        <br />
      </h1>
      <div id="select-all">
        <div>
          <input type="checkbox" id="select-all-in-source" />
          <label htmlFor="select-all-in-source">
            Select All In{" "}
            <b data-title={source} data-timing={0}>
              Source
            </b>
          </label>
        </div>
        <div>
          <label htmlFor="select-all-in-destination">
            Select All In{" "}
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
