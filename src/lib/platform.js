export const MAC = "MAC";
export const WINDOWS = "WINDOWS";
export const LINUX = "LINUX";
export const DEFAULT = "NOTFOUND";
export function getOperatingSystem() {
  let platform = navigator?.userAgent?.toLowerCase();
  if (platform?.includes("mac")) return MAC;
  else if (platform?.includes("windows")) return WINDOWS;
  else if (platform?.includes("linux")) return LINUX;
  else return DEFAULT;
}
