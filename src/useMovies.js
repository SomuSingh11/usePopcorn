import { useEffect, useState } from "react";

const KEY = `${import.meta.env.VITE_OMDb_API_KEY}`;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [showInitialMessage, setShowInitialMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();
      // Implementing Request Cleanup
      const controller = new AbortController();
      const signal = controller.signal;

      // Fetch movies data when component mounts
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: signal }
          );

          if (!res.ok) {
            throw new Error("Something went Wrong while fetching Movies");
          }

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie Not Found");

          setMovies(data.Search);
          //console.log(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error(error.message);
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setShowInitialMessage(true);
        setMovies([]);
        setError("");
        return;
      }
      setShowInitialMessage(false);

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error, showInitialMessage };
}
