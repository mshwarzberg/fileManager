import React, { useContext } from "react";
import { ItemContext } from "../Components/Explorer";

function RenderViewItem(type, property, index, filename) {
  const { setViewItem} = useContext(ItemContext)

  if (type === "videoIcon") {
    return setViewItem({
      type: "videoIcon",
      property: property,
      index: index,
      name: filename,
    });
  } else if (
    type === "imageIcon" ||
    type === "gifIcon" ||
    type === "documentIcon"
  ) {
    fetch(`/api/loadfiles/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: filename,
        type: type,
      }),
    })
      .then(async (res) => {
        const response = await res.blob();

        if (res.headers.get("type") === "image") {
          const imageURL = URL.createObjectURL(response);
          return setViewItem({
            type: "imageIcon",
            property: imageURL,
            index: index,
            name: filename,
          });
        } else {
          const reader = new FileReader();

          reader.onload = function () {
            setViewItem({
              type: "documentIcon",
              property: reader.result,
              index: index,
              name: filename,
            });
          };
          reader.readAsBinaryString(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return <></>
}

export default RenderViewItem