import { useLayoutEffect, useState } from "react";

export function useWindowResize(onWindowResize: () => void, deps?: any[]) {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
      onWindowResize();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [onWindowResize, ...(deps || [])]);
  return size;
}
