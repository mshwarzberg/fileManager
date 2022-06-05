import { useEffect, useState } from "react";
// the dependency allows react to rerender whenever I feel like it
export default function useFetch(url, body, dependency) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (dependency) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then(async (res) => {
          const response = await res.json();
          if (!response.err) {
            setData(response);
          }
          if (response.err) {
            setData({
              err: response.err,
            });
          }
        })
        .catch(() => {
          setData({
            err: "Error occured",
          });
        });
    }
  }, [url, body, dependency]);

  return { data };
}
