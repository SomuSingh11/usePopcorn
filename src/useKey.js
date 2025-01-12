import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      const handleKeyPress = (event) => {
        if (event.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      };

      document.addEventListener("keydown", handleKeyPress);

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    },
    [action, key]
  );
}
