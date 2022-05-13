import React, { useState, useEffect, useContext } from "react";
import { DirectoryStateContext } from "../../App";
import useFetch from "../../Hooks/useFetch";
import shortHandFileSize from "../../Helpers/FileSize";
import Navbar from "../Navbar/Navbar";
import RenderFiles from "../Rendering/RenderFiles";

function LoadDirectoryData() {
  const { state, dispatch } = useContext(DirectoryStateContext);

  const [itemsInDirectory, setItemsInDirectory] = useState();
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (notFoundError === true) {
      setTimeout(() => {
        dispatch({type: "directoryNotFoundError"});
        setNotFoundError(false);
      }, 3000);
    }
  }, [notFoundError, dispatch]);

  useEffect(() => {
    fetch("/api/loadfiles/setdirectorytocurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentdirectory: state.currentDirectory }),
    });
  }, [state.currentDirectory]);

  const {data: itemData } = useFetch('/api/data/data', JSON.stringify({ currentdirectory: state.currentDirectory }))

  useEffect(() => {
    if (itemData) {
      setItemsInDirectory(itemData)
      for (let i in itemData) {
        fetch("/api/data/thumbs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prefix: itemData[i].prefix,
            currentdirectory: `/${state.currentDirectory}`,
            suffix: itemData[i].fileextension,
          }),
        })
          .then(async (res) => {
            let response = await res.blob();
            let imageURL = URL.createObjectURL(response);
            setItemsInDirectory((prevItem) => {
              return prevItem.map((item) => {
                const newData = {
                  ...item,
                  shorthandsize: shortHandFileSize(item.size),
                  thumbnail:
                    res.headers.get("prefix") === item.prefix &&
                    res.headers.get("suffix") === item.fileextension
                      ? imageURL
                      : item.thumbnail,
                };
                return newData;
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [itemData, state.currentDirectory])

  return (
    <div id="LoadDirectoryData--page">
      <Navbar
        itemsInDirectory={itemsInDirectory}
        setItemsInDirectory={setItemsInDirectory}
      />
      <RenderFiles itemsInDirectory={itemsInDirectory} />
    </div>
  );
}

export default LoadDirectoryData;
