export default function Drag({ drag, selectedItems }) {
  return (
    <div
      id="drag-box"
      style={{
        left: drag.x + "px",
        top: drag.y + "px",
      }}
    >
      <p id="count">{selectedItems.length}</p>
      <div id="mode">
        {drag.mode ? (
          `
      + ${drag.mode === "move" ? "Move" : "Copy"} items to ${drag.destination}`
        ) : (
          <div id="not-allowed">
            <div id="line-through" />
          </div>
        )}
      </div>
    </div>
  );
}
