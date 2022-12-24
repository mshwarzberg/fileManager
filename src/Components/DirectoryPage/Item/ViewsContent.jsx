import { useContext } from "react";
import { GeneralContext } from "../../Main/Main.tsx";

import formatDuration from "../../../Helpers/FormatVideoTime";
import formatSize from "../../../Helpers/FormatSize.js";
import formatDate from "../../../Helpers/FormatDate.js";

export default function ViewsContent({ directoryItem }) {
  const {
    views: { pageView, detailsTabWidth },
  } = useContext(GeneralContext);

  const {
    size,
    modified,
    dimensions,
    fileextension,
    filetype,
    duration,
    description,
  } = directoryItem;

  if (pageView === "content") {
    return (
      <>
        <div className="information-container">
          <p className="date">
            Date Modified: {formatDate(new Date(modified), true)}
          </p>
          {size ? <p>Size: {formatSize(size)}</p> : <></>}
        </div>
        <div className="metadata-container">
          <p className="dimensions">Dimensions: {dimensions}</p>
          <p className="type">
            Type:&nbsp;
            {fileextension ? filetype.toUpperCase() : "FOLDER"}
          </p>
        </div>
      </>
    );
  } else if (pageView === "details") {
    return (
      <>
        <p
          className="details-metadata"
          style={{
            width: detailsTabWidth.modified + "rem",
            marginLeft: detailsTabWidth.name + "rem",
          }}
        >
          {formatDate(new Date(modified))}
        </p>
        <p
          className="details-metadata"
          style={{
            width: detailsTabWidth.type + "rem",
          }}
        >
          Type:&nbsp;
          {fileextension
            ? fileextension.slice(1, Infinity).toUpperCase() + " FILE"
            : "FOLDER"}
        </p>
        <p
          className="details-metadata"
          style={{
            width: detailsTabWidth.size + "rem",
          }}
        >
          {formatSize(size)}
        </p>
        {detailsTabWidth.dimensions !== 0 && (
          <p
            className="details-metadata"
            style={{
              width: detailsTabWidth.dimensions + "rem",
            }}
          >
            {parseInt(dimensions) ? dimensions : ""}
          </p>
        )}
        {detailsTabWidth.duration !== 0 && (
          <p
            className="details-metadata"
            style={{
              width: detailsTabWidth.duration + "rem",
            }}
          >
            {duration ? formatDuration(duration) : ""}
          </p>
        )}
        {detailsTabWidth.description !== 0 && (
          <p
            className="details-metadata"
            style={{
              width: detailsTabWidth.description + "rem",
              whiteSpace: "nowrap",
              textOverflow: "clip",
              overflow: "hidden",
            }}
          >
            {description || ""}
          </p>
        )}
      </>
    );
  } else if (pageView === "tiles") {
    return <p>{dimensions}</p>;
  }
}
