import { useEffect, useState } from "react";

export default function useFetch(url, body) {
  const [data, setData] = useState(null);
  useEffect(() => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then(async (res) => {
          setData(await res.json());
        })
        .catch((err) => console.log(err));
  }, [url, body]);

  return { data };
}
