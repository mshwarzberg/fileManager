import { findInItemsSelected } from "./SearchArray";

export default function handleItemsSelected(
  e,
  itemsSelected,
  setItemsSelected,
  lastSelected,
  setLastSelected
) {
  if (e.shiftKey) {
    const pageBlocks = [
      ...document.getElementsByClassName("display-page-block"),
    ];
    let selected = [];
    if (!itemsSelected[0]) {
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
    setItemsSelected(selected);
    return;
  } else if (e.ctrlKey) {
    if (!findInItemsSelected(itemsSelected, e.target, "element")) {
      setItemsSelected((prevItemsSelected) => [
        ...prevItemsSelected,
        {
          element: e.target,
          info: JSON.parse(e.target.dataset.info || "{}"),
        },
      ]);
      return;
    } else {
      setItemsSelected((prevItemsSelected) => {
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
  } else {
    setItemsSelected([
      { element: e.target, info: JSON.parse(e.target.dataset.info || "{}") },
    ]);
  }
  setLastSelected(e.target);
}
