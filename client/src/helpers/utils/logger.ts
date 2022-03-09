import { IS_SERVER } from "./constants";

function log(...args: any) {
  if (process.env.NEXT_PUBLIC_ENV === "dev") {
    console.log(...args);
  } else if (!IS_SERVER) {
    // in prod only log if you have query param
    const params = new URLSearchParams(window.location.search);
    if (params.has("debug")) {
      console.log(...args);
    }
  }
}
function error(...args: any) {
  if (process.env.NEXT_PUBLIC_ENV === "dev") {
    console.error(...args);
  } else if (!IS_SERVER) {
    // in prod only log if you have query param
    const params = new URLSearchParams(window.location.search);
    if (params.has("debug")) {
      console.error(...args);
    }
  }
}

const exports = { log, error };
export default exports;
