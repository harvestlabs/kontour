import { IS_SERVER, KONTOUR_REFRESH_CONTRACT } from "./constants";

export const RefreshContractEvent = IS_SERVER
  ? null
  : new CustomEvent(KONTOUR_REFRESH_CONTRACT);
