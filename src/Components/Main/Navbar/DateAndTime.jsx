import React, { useState, useEffect } from "react";
import FormatDate from "../../../Helpers/FormatDate";

export default function DateAndTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <h1 id="current-time">{FormatDate(time, true)}</h1>;
}
