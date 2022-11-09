import { findInArray } from "./SearchArray";

export default function handleItemsSelected(
  e,
  setSelectedItems,
  lastSelected,
  setLastSelected
) {
  if (e.shiftKey) {
    const pageItems = [...document.getElementsByClassName("page-item")];
    let selected = [];
    setSelectedItems((prevItemsSelected) => {
      if (!prevItemsSelected[0]) {
        selected = pageItems
          .slice(0, pageItems.indexOf(e.target) + 1)
          .map((block) => block.id);
        setLastSelected(pageItems[0].id);
      } else {
        const anchorElement = pageItems.indexOf(lastSelected);
        const flexElement = pageItems.indexOf(e.target);

        selected = pageItems
          .slice(
            Math.min(anchorElement, flexElement),
            Math.max(anchorElement, flexElement) + 1
          )
          .map((block) => block.id);
      }
      return selected;
    });
    return;
  } else if (e.ctrlKey) {
    setSelectedItems((prevItemsSelected) => {
      if (!prevItemsSelected.includes(e.target.id)) {
        return [...prevItemsSelected, e.target.id];
      } else {
        return prevItemsSelected
          .map((prevItemSelected) => {
            if (prevItemSelected === e.target.id) {
              return;
            }
            return prevItemSelected;
          })
          .filter((prevItemSelected) => prevItemSelected && prevItemSelected);
      }
    });
  } else {
    setSelectedItems((prevItemsSelected) => {
      if (!prevItemsSelected.includes(e.target.id) || e.button !== 2) {
        return [e.target.id];
      }
      return [];
    });
  }
  setLastSelected(e.target.id);
}
