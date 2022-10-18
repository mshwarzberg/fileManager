export default function Popup({ popup, setPopup }) {
  const { body, ok, cancel, thirdButton } = popup;

  return (
    <div id="popup-body">
      <div id="close-container">
        <button
          id="close"
          onClick={() => {
            setPopup({});
          }}
        >
          X
        </button>
      </div>
      {body}
      <div id="buttons-container">
        <div id="buttons">
          {thirdButton}
          {cancel}
          {ok}
        </div>
      </div>
    </div>
  );
}
