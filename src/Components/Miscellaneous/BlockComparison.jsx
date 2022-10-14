import { useEffect, useState } from "react";
import formatDate from "../../Helpers/FormatDate";
import formatSize from "../../Helpers/FormatSize";
import formatTitle from "../../Helpers/FormatTitle";
import FFprobe from "../../Helpers/FS and OS/FFprobe";

import folderImage from "../../Images/folder.png";

export default function BlockComparison({
  directoryItem,
  source,
  location,
  setDump,
  dump,
  newItemName,
}) {
  const {
    thumbPath,
    name,
    size,
    modified,
    isMedia,
    filetype,
    path,
    key,
    isDirectory,
    prefix,
    fileextension,
  } = directoryItem;

  const [media, setMedia] = useState({});
  const [test, setTest] = useState(dump[name]);
  const isLocationSource = location === source;

  function handleChange(e) {
    setDump((prevDump) => ({
      ...prevDump,
      [newItemName(prefix, fileextension)]: e.target.checked,
    }));
  }

  useEffect(() => {
    setTest(dump[newItemName(prefix, fileextension)]);
  }, [dump]);

  return (
    <div
      key={key}
      className="block-container"
      data-title={formatTitle(directoryItem, media)}
      onMouseEnter={() => {
        if (isMedia) {
          FFprobe(path, filetype, setMedia);
        }
      }}
    >
      {isLocationSource && <div className="separator" />}
      <input
        type="checkbox"
        name={name}
        value={test}
        defaultChecked={dump[name]}
        onChange={handleChange}
      />
      <img src={thumbPath} />
      {isDirectory && <img src={folderImage} />}
      {size ? <p className="size">{formatSize(size)}</p> : <></>}
      <pre className="date">{formatDate(new Date(modified))}</pre>
      {isLocationSource && <p className="name">{name}</p>}
    </div>
  );
}
