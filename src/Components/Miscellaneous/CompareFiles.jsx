import { useContext, useState, useEffect } from "react";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import { DirectoryContext } from "../Main/App";
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

  const [dump, setDump] = useState([]);
  // getItemMetadata(source).map((item) => {
  //   return {
  //     [newItemName(item.prefix, item.fileextension)]: false,
  //   };
  // })

  function renderItem(location) {
    return getItemMetadata(location).map((directoryItem) => {
      return (
        <BlockComparison
          key={directoryItem.key}
          directoryItem={directoryItem}
          source={source}
          location={location}
          setDump={setDump}
          dump={dump}
          newItemName={newItemName}
        />
      );
    });
  }

  function newItemName(prefix, fileextension) {}

  return (
    <div id="body">
      Which item would you like to keep?
      <br />
      (selecting both will have a new number added to the end of the name)
      <br />
      <div id="file-comparison">
        <div id="left">
          <div className="checkbox-name-container">
            <input type="checkbox" />
            <p data-title={source}>File in {source}</p>
          </div>
          {renderItem(source).map((item) => {
            return item;
          })}
        </div>
        <div id="right">
          <div className="checkbox-name-container">
            <input type="checkbox" />
            <p data-title={destination}>Files already in {destination}</p>
          </div>
          {renderItem(destination).map((item) => {
            return item;
          })}
        </div>
      </div>
    </div>
  );
}
