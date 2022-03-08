import { useAppSelector } from "@redux/hooks";
import { selectAddress, selectUserId } from "@redux/slices/userSlice";
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
  }, deps);
  return size;
}

export function useLoggedInUser(id?: string | null) {
  const loggedInUserId = useAppSelector(selectUserId);
  const loggedInUserAddress = useAppSelector(selectAddress);
  const loggedIn = loggedInUserId !== "";

  return {
    loggedIn,
    loggedInUserId,
    loggedInUserAddress,
    isUser: id === loggedInUserId,
  };
}
