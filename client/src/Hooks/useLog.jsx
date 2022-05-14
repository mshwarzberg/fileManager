import { useEffect } from "react";

export default function useLog(value) {
  useEffect(() => {
    console.log(value);
  }, [value])
}