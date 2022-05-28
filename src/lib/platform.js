export function getOperatingSystem() {
  const MAC = "MAC";
  const WINDOWS = "WINDOWS";
  const LINUX = "LINUX";
  const DEFAULT = "NOTFOUND";
  let platform = navigator.userAgentData.platform.toLowerCase();
  if (platform.includes("mac")) return MAC;
  else if (platform.includes("windows")) return WINDOWS;
  else if (platform.includes("linux")) return LINUX;
  else return DEFAULT;
}
