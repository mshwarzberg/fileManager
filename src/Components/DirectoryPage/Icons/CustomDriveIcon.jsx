import React from "react";

export default function CustomDriveIcon({
  directoryItem,
  directoryItem: { size: capacity, availableSpace, online, key },
}) {
  const spaceUsed = 1 - availableSpace / capacity;

  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
      }}
    >
      <rect
        width={60}
        height={80}
        stroke="black"
        strokeWidth="1"
        fill="#44444499"
        y="5"
        x="20"
        rx="3"
      />
      <React.Fragment key="screws">
        <circle cx="26" cy="12" r="2" fill="silver" name="top-left" />
        <circle cx="26" cy="78" r="2" fill="silver" name="bottom-left" />
        <circle cx="74" cy="12" r="2" fill="silver" name="top-right" />
        <circle cx="74" cy="78" r="2" fill="silver" name="bottom-right" />
      </React.Fragment>
      <React.Fragment key="platter">
        {online ? (
          <linearGradient id={key}>
            <stop offset={0} stopColor={spaceUsed < 0.9 ? "green" : "red"} />
            <stop
              offset={1 - availableSpace / capacity}
              stopColor={spaceUsed < 0.9 ? "green" : "red"}
            />
            <stop offset={1 - availableSpace / capacity} stopColor="white" />
            <stop offset={1} stopColor="white" />
          </linearGradient>
        ) : (
          <linearGradient id={key}>
            <stop offset={0} stopColor="red" />
            <stop offset={1} stopColor="red" />
          </linearGradient>
        )}
        <circle
          cx="-35"
          cy="50"
          r="23"
          fill={`url(#${key})`}
          name="platter"
          transform="rotate(-90)"
        />
        <circle cx="50" cy="35" r="2.7" fill="silver" name="platter-center" />
      </React.Fragment>
      <React.Fragment key="needle">
        <rect
          width={6.5}
          height={25}
          fill="#666"
          y="24"
          x="57.5"
          rx="5"
          name="spinner-needle"
          transform="rotate(28)"
        />
        <rect
          width={6.5}
          height={17}
          fill="#666"
          y="18"
          x="57.5"
          rx="50"
          transform="rotate(28)"
        />
        <circle cx="33" cy="67" r="6" fill="#666" name="needle-back" />
        <circle cx="32.5" cy="67.5" r="2.5" fill="silver" name="screw-back" />
        <rect
          width={3}
          height={19}
          fill="#666"
          y="31"
          x="57"
          transform="rotate(20)"
        />
        <rect
          width={3}
          height={21}
          fill="#666"
          y="14"
          x="60.5"
          transform="rotate(36.5)"
        />
      </React.Fragment>
    </svg>
  );
}
