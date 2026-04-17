import { useCallback } from "react";

function useNotify() {
  return useCallback((message) => {
    if (message) {
      window.alert(message);
    }
  }, []);
}

export default useNotify;
