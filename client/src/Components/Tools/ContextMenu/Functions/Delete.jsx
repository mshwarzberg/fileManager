import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import { UIContext } from "../../GeneralUI";

export default function Delete({ info }) {
  const { setDirectoryItems, itemsSelected } = useContext(GeneralContext);
  const { setPopup } = useContext(UIContext);

  function deleteItem() {
    const deleteItems = [];
    for (const selected of itemsSelected) {
      deleteItems.push(selected.info.path + selected.info.name);
    }
    fetch("/api/manage/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: deleteItems,
      }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.err) {
          setPopup({
            type: "alert",
            dialog: response.err,
          });
        } else {
          setDirectoryItems((prevItems) => {
            return prevItems
              .map((item) => {
                if (deleteItems.includes(item.path + item.name)) {
                  return {};
                }
                return item;
              })
              .filter((item) => {
                return item.name && item;
              });
          });
        }
      })
      .catch(() => {
        return;
      });
  }
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        setPopup({
          type: "confirm",
          dialog: `Are you sure you want to delete ${
            itemsSelected.length === 1
              ? "this item"
              : `these ${itemsSelected.length} items`
          }?`,
          confirmFunction: deleteItem,
        });
      }}
    >
      Delete
    </button>
  );
}
