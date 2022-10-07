import { findInArray } from "./SearchArray";

export default function handleItemsSelected(
  e,
  selectedItems,
  setSelectedItems,
  lastSelected,
  setLastSelected
) {
  if (e.shiftKey) {
    const pageBlocks = [
      ...document.getElementsByClassName("display-page-block"),
    ];
    let selected = [];
    if (!selectedItems[0]) {
      selected = pageBlocks
        .slice(0, pageBlocks.indexOf(e.target) + 1)
        .map((block) => ({
          element: block,
          info: JSON.parse(block.dataset.info || "{}"),
        }));
      setLastSelected(pageBlocks[0]);
    } else {
      const anchorElement = pageBlocks.indexOf(lastSelected);
      const flexElement = pageBlocks.indexOf(e.target);

      selected = pageBlocks
        .slice(
          Math.min(anchorElement, flexElement),
          Math.max(anchorElement, flexElement) + 1
        )
        .map((block) => ({
          element: block,
          info: JSON.parse(block.dataset.info || "{}"),
        }));
    }
    setSelectedItems(selected);
    return;
  } else if (e.ctrlKey) {
    if (!findInArray(selectedItems, e.target, "element")) {
      setSelectedItems((prevItemsSelected) => [
        ...prevItemsSelected,
        {
          element: e.target,
          info: JSON.parse(e.target.dataset.info || "{}"),
        },
      ]);
      return;
    } else {
      setSelectedItems((prevItemsSelected) => {
        return prevItemsSelected
          .map((prevItemSelected) => {
            if (prevItemSelected.element === e.target) {
              return {};
            }
            return prevItemSelected;
          })
          .filter(
            (prevItemSelected) => prevItemSelected.element && prevItemSelected
          );
      });
    }
  } else if (
    !selectedItems
      .map((selectedItem) => selectedItem.element)
      .includes(e.target) ||
    e.button !== 2
  ) {
    setSelectedItems([
      { element: e.target, info: JSON.parse(e.target.dataset.info || "{}") },
    ]);
  } else {
  }
  setLastSelected(e.target);
}
