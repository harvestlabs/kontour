import { IS_SERVER } from "./constants";

function log(...args: any) {
  if (process.env.NEXT_PUBLIC_ENV === "dev") {
    console.log("[logger]", ...args);
  } else if (!IS_SERVER) {
    // in prod only log if you have query param
    const params = new URLSearchParams(window.location.search);
    if (params.has("debug")) {
      console.log("[logger]", ...args);
    }
  }
}
function error(...args: any) {
  if (process.env.NEXT_PUBLIC_ENV === "dev") {
    console.error("[logger]", ...args);
  } else if (!IS_SERVER) {
    // in prod only log if you have query param
    const params = new URLSearchParams(window.location.search);
    if (params.has("debug")) {
      console.error("[logger]", ...args);
    }
  }
}

const exports = { log, error };
export default exports;
