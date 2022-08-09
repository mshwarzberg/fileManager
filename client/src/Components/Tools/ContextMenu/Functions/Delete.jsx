import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import { UIContext } from "../../GeneralUI";

export default function Delete({ info }) {
  const { setDirectoryItems } = useContext(GeneralContext);
  const { itemsSelected, setConfirm } = useContext(UIContext);

  function deleteItem() {
    const deleteTheseItems = [];
    for (const selected of itemsSelected) {
      deleteTheseItems.push(selected.path);
    }
    fetch("/api/manage/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: deleteTheseItems,
      }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.err) {
          alert(response.err);
        } else {
          setDirectoryItems((prevItems) => {
            return prevItems
              .map((item) => {
                if (deleteTheseItems.includes(item.path)) {
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
        setConfirm({
          show: true,
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
